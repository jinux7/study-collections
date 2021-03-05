import Vue from 'vue'
import App from './views/App.vue'
import router from './router'
import store from './store'
import '../../common/flexible'
import '../../common/init.css'
import './server/api'
import NutUI from '@nutui/nutui';
import '@nutui/nutui/dist/nutui.scss';

NutUI.install(Vue);
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
