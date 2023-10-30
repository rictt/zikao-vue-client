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
      label: '关于我们',
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

</script>

<template>
  <div class="min-w-[650px]">
    <div class="shadow-sm">
      <div class="pc-container flex items-center justify-between">
        <div class="logo flex items-center text-left">
          <img class="w-[60px] h-[60px]" src="./assets/image/logo_128x128.png" alt="">
          <div class="pl-3 font-serif">
            <div class="text-lg font-bold text-black">全国高等自考</div>
            <div class="text-black">刷题版</div>
          </div>
        </div>
        <div class="routes flex-1 text-left px-2 leading-[60px] tracking-[4px]">
          <div v-for="r in state.routes" :key="r.name"
            class="route px-4 relative inline-flex cursor-pointer"
            @click="onClickRoute(r)"
            :class="r.name === route.name ? `text-primary font-bold after:absolute after:bottom-[6px] after:bg-primary  after:leading-normal after:w-[30px] after:h-[3px] after:rounded-lg after:left-[50%] after:translate-x-[-60%]` : ''"
          >
            {{ r.label }}</div>
        </div>
        <div class="flex items-center">
          <img src="./assets/image/qq.png" class="w-[84px] scale-[1.2]" alt="">
          <a href="" class="pl-6 text-sm text-[#666] underline py-2">加入自考交流群</a>
        </div>
      </div>
    </div>
    <div class="pc-container py-4">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped lang="less">
.logo {
  padding: .75em 1em;
}
</style>
