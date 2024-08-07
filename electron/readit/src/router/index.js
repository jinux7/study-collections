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
    path: '/imageGallery',
    name: 'imageGallery',
    component: ()=> import('@/views/imageGallery.vue') 
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;