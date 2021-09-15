import { createApp } from 'vue'
import { router } from './router'
import { store } from './store'
import App from './App.vue'
import '@/libs/flexible'
import '@/libs/init.css'
import '@/api'
import Vant from 'vant'
import 'vant/lib/index.css'

// init mock api
import { worker } from './mocks/browser'
worker.start()
createApp(App)
.use(router)
.use(store)
.use(Vant)
.mount('#app')
