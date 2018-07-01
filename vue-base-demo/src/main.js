/**
 * @description vue的入口文件
 */
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import store from '@/store/store'
import 'element-ui/lib/theme-chalk/index.css'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/css/init.less'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueAxios, axios)  //挂载axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
