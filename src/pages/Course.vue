<script setup>
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getExamListByCourseId, addCourseView } from '@/api';

const state = reactive({
  examList: [],
  courseDetail: {}
})
const route = useRoute()
const getExamList = () => {
  if (route.query.id) {
    getExamListByCourseId(route.query.id)
      .then(res => {
        state.courseDetail = res
        state.examList = res.exam_list || []
        addCourseView(route.query.id)
      })
  }
}
onMounted(() => {
  getExamList()
})

const router = useRouter()
const goExam = (item) => {
  router.push({
    name: 'Exam',
    query: {
      id: item.id,
      cid: item.course_id
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
  <div>
    <div class="py-2 px-4 rounded-md bg-white text-[#999] font-bold leading-[46px]">
      <span class="cursor-pointer" @click="goHome">题库/历年真题</span>/{{ state.courseDetail.title || '-' }}
    </div>
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