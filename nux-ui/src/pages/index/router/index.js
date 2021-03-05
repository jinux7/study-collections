import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      keepAlive: true,
      title: 'title-home'
    },
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      keepAlive: true,
      title: 'title-about'
    },
    component: () => import('../views/About.vue')
  },
  { 
    path: '*',
    redirect: '/home' 
  }
]

const router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }), // 路由跳转后页面回到顶部
  routes
})
router.beforeEach((to,from,next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});
export default router
