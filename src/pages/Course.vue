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
        const list = (res.exam_list || []).sort((a, b) => {
          let time = a.title ? new Date(a.title.replace('年', '-').replace('月', '')) : ''
          let btime = b.title ? new Date(b.title.replace('年', '-').replace('月', '')) : ''
          return btime - time
        })
        state.examList = list
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

const goQQ = () => {
  window.open('https://qm.qq.com/cgi-bin/qm/qr?k=Gu02gzg0safRMKxEKJtOkrIoiOq9l0fz&jump_from=webapi&authKey=hwsMVQ5VrjfzONDNXvINyqc2keY6hQKh2mO46LUYqGc313Q9Y6wsXkv8CXqXIoZS', '_blank')
}
</script>

<template>
  <div class="px-4">
    <div class="py-2 px-4 rounded-md bg-white text-[#999] font-bold leading-[46px]">
      <span class="cursor-pointer" @click="goHome">题库/历年真题</span>/{{ state.courseDetail.title || '-' }}
      <el-button @click="goQQ" type="text" size="large">没有最新的真题？反馈</el-button>
      <el-button @click="goQQ" type="primary" size="large">课程教材、真题、解析打包下载</el-button>
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