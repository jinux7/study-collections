import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'normalize.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/style.css'

createApp(App).use(createPinia()).use(router).use(ElementPlus).mount('#app');
