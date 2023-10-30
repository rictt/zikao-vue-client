<script setup>
import { onMounted, reactive, ref } from 'vue';
import data from './index.json'
import { questionChange } from '../utils/decode'
import { getQuestionListByExamId } from '../api';
import { useRoute } from 'vue-router';

const getQuestionList = (id) => {
  getQuestionListByExamId(id)
    .then(res => {
      const data = handleQuestion(res)
      state.questionList = data;
    })
}

onMounted(() => {
  const route = useRoute()
  if (route.query.id) {
    getQuestionList(route.query.id)
  }
})

const handleQuestion = (data) => {
  const d = questionChange(data)
  // return d.slice(0, 4)
  return d;
}
const state = reactive({
  questionList: handleQuestion(data)
})
</script>

<template>
  <div class="px-10 py-2 leading-[2.25]">
    <div v-for="(question, index) in state.questionList" :key="question.id">
      <div class="font-bold flex" v-html="`${index + 1}.${question.title}`"></div>
      <div class="text-primary" v-if="question.type == '4'" v-html="question.analyse">
      </div>
      <div v-if="question.type != '4' && question.choseList" class="flex flex-col text-md leading-[2] pl-4">
        <!-- <div v-for="(op, opIndex) in question.choseList" :class="opIndex === question.correctIndex ? 'text-primary' : ''">{{ -->
        <div class="flex items-center" v-for="(op, opIndex) in question.choseList"
          :class="question.answerArr && question.answerArr.includes(['A', 'B', 'C', 'D', 'E', 'F'][opIndex]) ? 'text-primary' : ''">
            <span class="pr-2">{{ ['A', 'B', 'C', 'D', 'E', 'F'][opIndex] }}.</span>
            <span v-html="op.item"></span>
          </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>