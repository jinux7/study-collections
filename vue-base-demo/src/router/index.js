/**
 * @description router设置
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//import components
import loginComponent from '@/pages/login'
import layoutComponent from '@/pages/layout'
import homeComponent from '@/pages/home/home.vue'
import page1Component from '@/pages/page1/page1'
import page2Component from '@/pages/page2/page2'

Vue.use(VueRouter)

//使用AMD方式加载
// component: resolve => require(['pages/home'], resolve),
const routes = [
{
  path: '/login',
  name: 'login',
  component: loginComponent
},
{
  path: '/',
  name: 'layout',
  component: layoutComponent,
  children: [
    {
      path: '/home',
      name: 'home',
      component: homeComponent,
    },
    {
      path: '/page1',
      name: 'page1',
      component: page1Component,
    },
    {
      path: '/page2',
      name: 'page2',
      component: page2Component,
    },
    {
      path: '*',
      redirect: '/home'
    },
  ]
}
]

const router = new VueRouter({
  routes,
  mode: 'hash', //default: hash ,history
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})

//全局路由配置
//路由开始之前的操作
router.beforeEach((to, from, next) => {
  NProgress.done().start()
  next();
})

//路由完成之后的操作
router.afterEach(() => {
  NProgress.done()
})

export default router