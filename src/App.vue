<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router';
import { reactive } from 'vue';

const state = reactive({
  routes: [
    {
      name: 'Home',
      label: '题库',
    },
    {
      name: 'About',
      label: '关于本站',
    },
  ]
})

const route = useRoute()
const router = useRouter()

const onClickRoute = (routeItem) => {
  if (routeItem.name === route.name) {
    return
  }
  router.push({
    name: routeItem.name
  })
}

const goHome = () => {
  router.push({
    name: 'Home'
  })
}

</script>

<template>
  <div class="min-w-[650px]">
    <div class="shadow-sm">
      <header class="pc-container flex items-center justify-between">
        <div class="logo flex items-center text-left cursor-pointer" @click="goHome">
          <img class="w-[60px] h-[60px]" src="./assets/image/logo_128x128.png" alt="">
          <div class="pl-3 font-serif">
            <div class="text-lg font-bold text-black">自考365</div>
            <div class="text-black">刷题版</div>
          </div>
        </div>
        <div class="routes flex-1 text-left px-2 leading-[60px] tracking-[4px]">
          <div v-for="r in state.routes" :key="r.name" class="route px-4 relative inline-flex cursor-pointer"
            @click="onClickRoute(r)"
            :class="r.name === route.name ? `text-primary font-bold after:absolute after:bottom-[6px] after:bg-primary  after:leading-normal after:w-[30px] after:h-[3px] after:rounded-lg after:left-[50%] after:translate-x-[-60%]` : ''">
            {{ r.label }}</div>
        </div>
        <div class="flex items-center">
          <img src="./assets/image/qq.png" class="w-[84px] scale-[1.2]" alt="">
          <a class="pl-6 text-sm text-[#666] underline py-2" target="_blank"
            href="https://qm.qq.com/cgi-bin/qm/qr?k=Gu02gzg0safRMKxEKJtOkrIoiOq9l0fz&jump_from=webapi&authKey=hwsMVQ5VrjfzONDNXvINyqc2keY6hQKh2mO46LUYqGc313Q9Y6wsXkv8CXqXIoZS">
            <img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="自考365学习|交流群" title="自考365学习|交流群">资料｜反馈群
          </a>
        </div>
      </header>
    </div>
    <div class="pc-container py-4 min-h-[80vh]">
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="['Home']">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </div>
  </div>
  <div class="py-[10px] w-full text-center bottom-0">
    <footer class="text-center py-[4px]">
      <a href="https://beian.miit.gov.cn/" target="_blank">ICP备案号：</a>
      <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2023128276号</a>
    </footer>
  </div>
</template>

<style scoped lang="less">
.logo {
  padding: .75em 1em;
}
</style>
