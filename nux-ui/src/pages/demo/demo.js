import Vue from 'vue'
import App from './views/App.vue'
import router from './router'
import store from './store'
import '../../common/flexible'
import '../../common/init.css'
import './server/api'
import NuxUi from '../../components/nux-ui/index.js'
import enUS from '../../components/nux-ui/locales/lang/en-US'

// 国际化使用英文
// Vue.use(NuxUi, {
//   locale: 'en-US',
//   lang: enUS
// });
Vue.use(NuxUi); // 国际化默认使用中文
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
