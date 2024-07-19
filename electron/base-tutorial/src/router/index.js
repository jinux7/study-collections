import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/detail',
    name: 'detail',
    component: ()=> import('@/views/Detail.vue')
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;