import { createRouter, createWebHashHistory } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/course',
    name: 'Course',
    component: () => import('../pages/Course.vue')
  },
  {
    path: '/exam',
    name: 'Exam',
    component: () => import('../pages/Exam.vue')
  },
  {
    path: '/',
    name: 'About',
    component: () => import('../pages/About.vue')
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})