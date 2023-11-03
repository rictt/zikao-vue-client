<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    default: () => {}
  },
  showAnswer: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
  }
})
const emits = defineEmits(['next'])

const selections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K']
const selectionsIndexMap = {}
selections.forEach((key, index) => {
  selectionsIndexMap[key] = index
})

const userAnswerFormat = (value) => {
  if (typeof value == 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.join('、')
  }
  return value
}

const isUserAnswerError = computed(() => {
  const question = props.question
  if (question.type <= 2 && question.userAnswer) {
    return question.userAnswer !== question.answerArr[0]
  }
  if (question.type == 3 && question.userAnswer && question.showAnalyse) {
    const sortFun = (a, b) => a - b
    return question.userAnswer.sort(sortFun).toString() !== question.answerArr.sort(sortFun).toString()
  }
  return false
})

const userAnswerChange = (value) => {
  if (props.question.type == 3 && !props.question.userSubmit) {
    return
  }
  if (!isUserAnswerError.value) {
    console.log('emit')
    return setTimeout(() => {
      emits('next')
    }, 1000)
  }
}

const questionTypeFormat = (type) => {
  return {
    "1": "单选题",
    "2": "判断题",
    "3": "多选题",
    "4": "问答题"
  }[type] || type
}

const showRightAnswer = computed(() => {
  if (props.question.type == '4') {
    return false
  }
  if (props.question.showAnalyse) {
    return true 
  }
  return props.question.showAnalyse || isUserAnswerError.value
})
</script>

<template>
  <div class="question-item">
    <div class="font-bold flex" v-html="`【${questionTypeFormat(question.type)}】${index}.${question.title}`"></div>
    <div v-if="question.type == '4'" class="pt-2 pb-4">
      <textarea class="border block w-[450px] p-1 h-[180px] rounded-sm resize-none focus:outline-primary text-sm" :spellcheck="false" />
    </div>
    <div v-if="['1', '2', '3', 1, 2, 3].includes(question.type) && question.choseList" class="flex flex-col text-md leading-[2] py-2">
      <el-radio-group v-if="question.type == 1 || question.type == 2" v-model="question.userAnswer" @change="userAnswerChange">
        <div class="w-full" v-for="(op, opIndex) in question.choseList">
          <el-radio :class="{
            error: (selectionsIndexMap[question.userAnswer] === opIndex) && isUserAnswerError,
            checked: (question.userAnswer || question.showAnalyse) && selectionsIndexMap[question.answerArr] === opIndex
          }" :label="selections[opIndex]" checked>
            <span class="pr-2">{{ selections[opIndex] }}.</span>
            <span class="text-md" v-html="op.item"></span>
          </el-radio>
        </div>
      </el-radio-group>

      <el-checkbox-group v-if="question.type == 3" v-model="question.userAnswer" @change="userAnswerChange">
        <div class="w-full" v-for="(op, opIndex) in question.choseList">
          <el-checkbox :label="selections[opIndex]" :class="{
            error: isUserAnswerError && question.userAnswer && question.userAnswer.includes(selections[opIndex]),
            checked: question.showAnalyse && question.answerArr.includes(selections[opIndex])
          }">
            <span class="pr-2">{{ selections[opIndex] }}.</span>
            <span class="text-md" v-html="op.item"></span>
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </div>

    <div class="pb-2" v-if="question.type == 3">
      <el-button type="primary" @click="() => {
        question.showAnalyse = true
      }">提交答案</el-button>
    </div>

    <div class="pb-2">
      <el-button type="primary" @click="() => {
        question.showAnalyse = true
      }">查看解析</el-button>
    </div>

      <div v-if="showRightAnswer" class="bg-[#f1f1f1] px-4 py-2 leading-[1.75] rounded-sm">
        <span class="font-bold">正确答案：</span>
        <span class="text-primary">{{ userAnswerFormat(question.answerArr) }}</span>
        <template v-if="question.userAnswer">
          <span class="font-bold pl-10">你的答案：</span>
          <span>{{ userAnswerFormat(question.userAnswer) }}</span>
        </template>
      </div>
      <template v-if="question.showAnalyse || isUserAnswerError">
        <div class="w-full h-[20px]"></div>
        <div class="bg-[#f1f1f1] px-4 py-2 leading-[1.75] rounded-sm">
          <span class="font-bold">解析：</span>
          <span v-html="question.analyse || '暂无解析'"></span>
        </div>
      </template>
  </div>
</template>

<style lang="less" scoped>
:deep(.el-radio.error) {
  .el-radio__inner {
    border-color: red;
    background-color: red;
  }
  .el-radio__label {
    color: red;
    text-decoration: line-through;
  }
}
:deep(.el-radio.checked) {
  .el-radio__inner {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary);
    &:after {
      transform: translate(-50%,-50%) scale(1);
    }
  }
  .el-radio__label {
    color: var(--el-color-primary);
  }
}
:deep(.el-checkbox.error) {
  .el-checkbox__label {
    color: red;
    text-decoration: line-through;
  }
  .el-checkbox__inner {
    border-color: red;
    background-color: red;
    &:after {
      transform: rotate(45deg) scaleY(1);
      border-color: white;
    }
  }
}
:deep(.el-checkbox.checked) {
  .el-checkbox__label {
    color: var(--el-color-primary);
    text-decoration: none;
  }
  .el-checkbox__inner {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary);
    &:after {
      transform: rotate(45deg) scaleY(1);
      border-color: white;
    }
  }
}
</style>
