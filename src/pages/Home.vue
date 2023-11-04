<script setup>
import { onMounted, reactive, watch } from 'vue';
import { router } from '../router';
import { getCourseList, addIndexPV } from '@/api';

const state = reactive({
  searchKey: '',
  searchResult: [],
  loaded: false,
  courseList: [
    // {
    //   id: 229,
    //   title: '03708 中国近现代史纲要',
    //   course_code: '03708',
    //   course_name: '中国近现代史纲要'
    // },
  ]
})


const getRandomBgClass = (index) => {
  const list = [
    'bg-sky-500',
    'bg-orange-400',
    'bg-lime-400',
    'bg-yellow-700',
    'bg-yellow-400',
    'bg-green-300',
    'bg-teal-300',
    'bg-sky-300',
    'bg-indigo-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-orange-500'
  ]
  return list[index % list.length]
}

const goCourse = (courseItem) => {
  router.push({
    name: 'Course',
    query: {
      id: courseItem.id
    }
  })
}

let timer = null
watch(() => state.searchKey, (value) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    fetchCourseList({ word: value })
  }, 500)
})

const fetchCourseList = (queries = {}) => {
  state.loaded = false
  getCourseList(queries).then(res => {
    const { list } = res
    state.courseList = list
  })
  state.loaded = true
}

onMounted(() => {
  fetchCourseList()
  addIndexPV()
})
</script>

<template>
  <div class="m-0 py-4 text-center">
    <div class="relative search-input inline-flex items-center w-[550px] bg-[#f1f1f1] rounded-[40px] h-[56px]">
      <div class="input-wrap flex-1 flex justify-between h-full">
        <input v-model="state.searchKey" class="flex-1 outline-0 border-0 px-6 bg-inherit h-full" type="text"
          placeholder="请输入课程名字/代码">
      </div>
      <div
        class="input-text cursor-pointer hover:bg-help text-white bg-primary min-w-[100px] leading-[56px] align-middle rounded-r-[40px]">
        搜索</div>
      <!-- <div v-show="state.searchResult.length" class="result-list absolute w-full border shadow-md border-gray-200 rounded-sm bottom-0 text-left left-0 translate-y-[110%] z-[11]">
        <div class="result-item leading-10 px-4 py-[4px] text-black text-md cursor-pointer hover:bg-[#f1f1f1]" v-for="item in state.searchResult" :key="item.label">{{ item.label }}</div>
      </div> -->
    </div>

    <div class="course-list w-[1100px] mx-auto text-left px-[10px] py-[10px] rounded-md my-[20px]">
      <div
        class="course-item w-[23%] border m-[10px] h-[120px] px-[20px] py-[14px] relative text-center rounded-md hover:shadow-md cursor-pointer transition-shadow items-center inline-flex flex-col mb-[20px] bg-white overflow-hidden"
        v-for="(item, index) in state.courseList" :key="item.id" @click="goCourse(item)">
        <div class="w-full flex items-center pb-[10px] text-left">
          <div
            class="w-[50px] h-[50px] min-w-[50px] inline-flex items-center text-white font-bold justify-center border-[50%] rounded-full"
            :class="getRandomBgClass(index)">
            {{ item.course_name[0] }}{{ item.course_name[1] }}
          </div>
          <div class="flex-1 px-[10px] font-bold">{{ item.course_name }}</div>
        </div>
        <div class="w-full text-sm text-left">{{ item.title }}</div>
      </div>
    </div>

    <div v-if="state.loaded && !state.courseList.length" class="flex flex-col text-center items-center justify-center">
      <div class="pb-4">暂无数据</div>
      <svg-icon size="80px" color="#666" name="huowu"></svg-icon>
    </div>
  </div>
</template>

<style scoped lang="less">
.logo {
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
