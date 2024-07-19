import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

import 'normalize.css'
import '@/assets/common.css'

createApp(App).use(createPinia()).use(router).mount('#app')
