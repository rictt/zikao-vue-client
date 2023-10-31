<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { questionChange } from '../utils/decode'
import { getQuestionListByExamId } from '../api';
import { useRoute, useRouter } from 'vue-router';
import { getItem, setItem, StorageUtil } from '@/utils/localstorage'

const styleStoreUtil = new StorageUtil('DRAFT_STYLE', { x: 0, y: 0, visible: true })
const router = useRouter()
const route = useRoute()
const state = reactive({
  courseDetail: {},
  examDetail: {},
  viewQuestionList: [],
  questionList: [],
  step: 5,
  loading: false,
  translateX: styleStoreUtil.getValue().x || 0,
  translateY: styleStoreUtil.getValue().y || 0,
  draftVisible: true
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

const draftBoxStyle = computed(() => {
  return {
    transform: `translate(${state.translateX}px, ${state.translateY}px)`
  }
})
const draftBox = ref('draftBox')
const listenerDraft = () => {
  let _downed = false
  let startX, startY, moveX, moveY, diffX, diffY = 0;
  const onMouseDown = (e) => {
    console.log(state.translateX, state.translateY)
    _downed = true
    startX = e.clientX - state.translateX
    startY = e.clientY - state.translateY
  }
  const onMouseMove = (e) => {
    if (!_downed) return
    moveX = e.clientX
    moveY = e.clientY
    diffX = moveX - startX
    diffY = moveY - startY
    console.log(diffX, diffY)
    state.translateX = diffX
    state.translateY = diffY
  }
  const onMouseUp = (e) => {
    _downed = false
    styleStoreUtil.setValue({
      x: diffX,
      y: diffY,
      visible: true
    })
  }
  draftBox.value.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  draftBox.value.addEventListener('mouseup', onMouseUp)
  return {
    remove: () => {
      draftBox.value.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      draftBox.value.removeEventListener('mouseup', onMouseUp)
    }
  }
}

onMounted(() => {
  const route = useRoute()
  if (route.query.id) {
    getQuestionList(route.query.id)
  }

  const onScroll = () => {
    listenerLastItem()
  }
  const { remove } = listenerDraft()
  window.addEventListener('scroll', onScroll)
  return () => {
    window.removeEventListener('scroll', onScroll)
    remove()
  }
})

const getQuestionList = (id) => {
  getQuestionListByExamId(id)
    .then(res => {
      state.examDetail = res
      const data = handleQuestion(res.question_list || [])
      state.courseDetail = res.course
      state.questionList = data;
      state.viewQuestionList = state.questionList.slice(0, state.viewQuestionList.length + 5)
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

</script>

<template>
  <div class="py-2 px-4 rounded-md bg-white text-[#999] font-bold leading-[46px]">
    <span class="cursor-pointer" @click="goHome">题库/</span>
    <span class="cursor-pointer" @click="goBack">历年真题/</span>
    <span>{{ state.courseDetail.title || '-' }}/</span>
    <span>{{ state.examDetail.title || '' }}</span>
  </div>
  <hr class="mb-[20px]">

  <div class="px-10 py-2 leading-[2.25]">
    <div class="question-item" v-for="(question, index) in state.viewQuestionList" :key="question.id">
      <div class="font-bold flex" v-html="`${index + 1}.${question.title}`"></div>
      <div class="text-primary" v-if="question.type == '4'" v-html="question.analyse">
      </div>
      <div v-if="question.type != '4' && question.choseList" class="flex flex-col text-md leading-[2] pl-4">
        <div class="flex items-center" v-for="(op, opIndex) in question.choseList"
          :class="question.answerArr && question.answerArr.includes(['A', 'B', 'C', 'D', 'E', 'F'][opIndex]) ? 'text-primary' : ''">
            <span class="pr-2">{{ ['A', 'B', 'C', 'D', 'E', 'F'][opIndex] }}.</span>
            <span v-html="op.item"></span>
          </div>
      </div>
    </div>
    <div :style="{ visibility: state.loading ? 'visible' : 'hidden' }" class="py-4 text-primary">加载中...</div>
  </div>

  <div v-show="state.draftVisible" ref="draftBox" :style="draftBoxStyle" class="select-none fixed right-2 bottom-14 bg-white rounded-md border border-primary shadow-md min-w-[240px] md:min-w-[340px]">
    <div class="relative text-center text-sm leading-[3] cursor-move font-bold">
      草稿纸
      <span class="absolute right-2 text-[#666] font-normal text-sm leading-[3] cursor-pointer" @click="state.draftVisible = false">关闭</span>
    </div>
    <hr />
    <div class="py-1 border-none outline-none px-0.5">
      <textarea :spellcheck="false" class="block w-full min-h-[200px] md:min-h-[260px] p-1 text-sm outline-none resize-none" placeholder="示例：&#10;1-15&#10;ABCDA&#10;BBDDA&#10;BBCDA"></textarea>
    </div>
  </div>
</template>

<style lang="less" scoped></style>