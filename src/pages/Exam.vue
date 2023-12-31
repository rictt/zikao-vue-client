<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { questionChange } from '../utils/decode'
import { getQuestionListByExamId } from '../api';
import { useRoute, useRouter } from 'vue-router';
import DraftBox from '@/components/DraftBox/index.vue'
import QuestionItem from '@/components/Question/index.vue'
import { copyText2Clipboard } from '@/utils/clipboard'
import { ElMessage } from 'element-plus';
import { StorageUtil } from '@/utils/localStorage'

const router = useRouter()
const route = useRoute()
const answerStorage = new StorageUtil('USER_ANSWER_' + route.query.id)
console.log(answerStorage)
const state = reactive({
  courseDetail: {},
  examDetail: {},
  viewQuestionList: [],
  questionList: [],
  step: 5,
  loading: false,
  draftVisible: false,
  mode: 1,
  answerMode: 1,
  stepMode: 1,
  currentPageIndex: 1,
  currentIndex: -1
})

watch(() => state.currentPageIndex, (value) => {
  state.currentIndex = value - 1
  answerStorage.setValue({ index: state.currentIndex })
})

let timer = null
const listenerLastItem = () => {
  if (state.viewQuestionList.length >= state.questionList.length && state.questionList.length > 0) {
    return
  }
  clearTimeout(timer)
  timer = setTimeout(() => {
    const list = [...document.querySelectorAll('.question-item')]
    if (!list.length) {
      return
    }
    const lastItem = list[list.length - 1]
    const screenH = window.innerHeight
    const rect = lastItem.getBoundingClientRect()
    const top = rect.top
    if (document.documentElement.scrollTop + screenH + 100 >= top) {
      state.loading = true
      setTimeout(() => {
        state.viewQuestionList = state.questionList.slice(0, state.viewQuestionList.length + 5)
        state.loading = false
      }, 1000)
    }
  }, 200)
}

onMounted(async () => {
  const route = useRoute()
  if (!route.query.id) {
    return
  }
  await getQuestionList(route.query.id)
  const answerRecord = answerStorage.getValue()
  if (answerRecord?.index) {
    openConfirm({
      title: '提示',
      content: '是否继续上次答题记录？',
      type: 'info',
      confirmButtonText: '确 认',
      cancelButtonText: '取 消'
    }).then(() => {
      state.currentIndex = answerRecord.index
    })
  }
  const onScroll = () => {
    listenerLastItem()
  }
  window.addEventListener('scroll', onScroll)
  return () => {
    window.removeEventListener('scroll', onScroll)
  }
})

const openConfirm = (params) => {
  const { content, title, confirmButtonText, cancelButtonText, type } = params
  return ElMessageBox.confirm(content, title, {
    confirmButtonText,
    cancelButtonText,
    type,
  })
}

const getQuestionList = (id) => {
  return new Promise((resolve, reject) => {
    getQuestionListByExamId(id)
      .then(res => {
        state.examDetail = res
        const data = handleQuestion(res.question_list || [])
        state.courseDetail = res.course
        state.questionList = data;
        state.currentIndex = 0;
        state.viewQuestionList = state.questionList.slice(0, state.viewQuestionList.length + 5)
      })
      .finally(() => {
        resolve()
      })
  })
}

const handleQuestion = (data) => {
  const d = questionChange(data)
  return d;
}

const goBack = () => {
  router.push({
    name: 'Course',
    query: {
      id: route.query.cid
    }
  })
}

const goHome = () => {
  router.push({
    name: 'Home'
  })
}

const icons = [
  {
    name: 'share',
    onClick: () => {
      copyText2Clipboard({
        copyText: `${window.location.href}`,
        onSuccess: () => {
          ElMessage.success('复制成功，请分享给你的好友吧～')
        },
        onError: () => {
          ElMessage.error('复制失败，该浏览器不支持自动复制')
        }
      })
    }
  },
  {
    name: 'back-top',
    onClick: () => {
      window.scrollTo({
        left: 0,
        top: 0
      })
    }
  },
  {
    name: 'ziliao',
    onClick: () => {
      state.draftVisible = !state.draftVisible
    }
  }
]

</script>

<template>
  <div class="py-2 px-4 rounded-md bg-white text-[#999] font-bold leading-[46px]">
    <span class="cursor-pointer" @click="goHome">题库/</span>
    <span class="cursor-pointer" @click="goBack">历年真题/</span>
    <span>{{ state.courseDetail.title || '-' }}/</span>
    <span>{{ state.examDetail.title || '' }}</span>
  </div>
  <hr class="mb-[20px]">

  <div class="relative">
    <div class="relative z-10 max-w-[800px]">
      <div class="px-10 py-2 leading-[2.25]">
        <template v-if="state.mode === 1 && state.questionList[state.currentIndex]">
          <QuestionItem @next="() => {
            if (state.stepMode === 1) {
              state.currentIndex++
              state.currentPageIndex++
            }
          }" :key="state.currentIndex + 1" :question="state.questionList[state.currentIndex]"
            :index="state.currentIndex + 1" :showAnswer="state.answerMode === 2">
          </QuestionItem>

        </template>
        <template v-if="state.mode === 2">
          <QuestionItem v-for="(question, index) in state.viewQuestionList" :key="index" :index="index + 1"
            :question="question" :showAnswer="state.answerMode === 2">
          </QuestionItem>
          <div :style="{ visibility: state.loading ? 'visible' : 'hidden' }" class="py-4 text-primary">加载中...</div>
        </template>

        <div v-if="state.mode === 1" class="py-4 flex items-center">
          <el-button class="mr-4" @click="() => {
            state.currentIndex--
            state.currentPageIndex--
          }" :disabled="state.currentIndex === 0">
            上一题
          </el-button>
          <el-pagination v-model:current-page="state.currentPageIndex" background layout="prev, pager, next"
            :total="state.questionList.length * 10" />
          <el-button type="primary" class="ml-4" :disabled="state.currentIndex + 1 >= state.questionList.length" @click="() => {
            state.currentIndex++
            state.currentPageIndex++
          }">
            下一题
          </el-button>
        </div>
      </div>
    </div>
    <div title="设置" class="border shadow-md rounded absolute top-0 right-0 p-4">
      <h3 class="font-bold mb-2">答题设置</h3>
      <div class="border shadow-sm px-2 py-2 rounded-sm">
        <div class="flex items-center text-sm font-bold">
          <div>试卷展示：</div>
          <el-radio-group v-model="state.mode">
            <el-radio :label="1">一页一题</el-radio>
            <el-radio :label="2">展示所有题目</el-radio>
          </el-radio-group>
        </div>
        <div class="flex items-center text-sm font-bold">
          <div>答题模式：</div>
          <el-radio-group v-model="state.answerMode">
            <el-radio :label="1">答题</el-radio>
            <el-radio :label="2">背题（直接显示答案）</el-radio>
          </el-radio-group>
        </div>
        <div class="flex items-center text-sm font-bold">
          <div>自动跳转：</div>
          <el-radio-group v-model="state.stepMode">
            <el-radio :label="1">跳转下一题</el-radio>
            <el-radio :label="2">停留原题</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>

  <div title="右下按钮区域" class="fixed right-[100px] bottom-[100px]">
    <div class="text-[28px]">
      <div class="p-4 border rounded-full bg-[#f1f1f1] mb-4" @click="item.onClick" v-for="item in icons" :key="item.name">
        <svg-icon class="cursor-pointer" :name="item.name" title="置顶"></svg-icon>
      </div>
    </div>
  </div>
  <DraftBox v-model="state.draftVisible" />
</template>

<style lang="less" scoped></style>