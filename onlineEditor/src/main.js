import { createApp, reactive } from 'vue'
import App from './App.vue'
import { ElButton, ElSelect } from 'element-plus'
import 'element-plus/dist/index.css'
import { ElLoadingDirective } from 'element-plus'
import 'nprogress/nprogress.css'
import { templateCode } from '@/config/constants'

const create = () => {
  const app = createApp(App)
  app.config.globalProperties.$store = reactive({
    languageType: 1, // 语言类型 1:html 2:vue
    htmlContent: templateCode.html, // html内容
    javascriptContent: templateCode.javascript, // javascript内容
    cssContent: templateCode.css, // css内容
    vueContent: templateCode.vue, // vue内容
    docContent: '', // 预览iframe的srcdoc内容
    iframeShow: true,
    consoleContent: [], // Console组件展示内容
  });
  app.use(ElSelect)
  app.use(ElButton)
  app.directive('loading', ElLoadingDirective)
  app.mount('#app')
}

const init = () => {
  create()
}
init()

