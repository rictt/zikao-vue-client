<script setup>
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getExamListByCourseId } from '@/api';

const state = reactive({
  examList: []
})

const getExamList = () => {
  const route = useRoute()
  if (route.query.id) {
    getExamListByCourseId(route.query.id)
      .then(res => {
        state.examList = res
      })
  }
}
onMounted(() => {
  getExamList()
})

const router = useRouter()
const goExam = (item) => {
  console.log(item)
  router.push({
    name: 'Exam',
    query: {
      id: item.id
    }
  })
}
</script>

<template>
  <div>
    <div class="py-2 px-4 rounded-md bg-white text-[#999] font-bold leading-[46px]">题库 - 历年真题 - 中国近现代史纲要</div>
    <hr class="mb-[20px]">
    <div class="bg-[#f1f1f1] py-[10px] px-[20px] rounded-md overflow-hidden">
      <div 
      v-for="item in state.examList" :key="item.id"
      class="leading-[35px]"
      @click="goExam(item)"
      >
      <div class="flex items-center cursor-pointer hover:font-bold">
        <svg-icon name="wenjian"></svg-icon>
        <div class="mx-[10px]">{{ item.title }}</div>
      </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
</style>