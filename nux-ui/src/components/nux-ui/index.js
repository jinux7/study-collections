import { locale } from './locales'
import znUS from './locales/lang/zn-CH'
import Button from './packages/button'
// methods
import Message from './packages/message'
import PopMsg from './packages/popmsg'
import Confirm from './packages/confirm'
import LoadingEarth from './packages/loadingearth'
// filters
import capitalize from './filters/capitalize'
// directives
import baseDirective from './directives/baseDirective'
// 组件列表
const components = [
  Button
]
// 方法列表
const methods = [
  Message,
  PopMsg,
  Confirm,
  LoadingEarth
]
// 过滤器
const filters = [
  capitalize
]
// 指令
const directives = [
  baseDirective
]

const install = function (Vue, opts={locale: 'zn-US',lang: znUS}) { // 国际化默认中文
  // 判断是否安装
  if(install.installed) return
  // 设置国际化
  if (opts.locale) {
    Vue.config.lang = opts.locale;
  }
  if (opts.lang) locale(Vue.config.lang, opts.lang);
  // 遍历注册全局组件
  components.map(component=> {
    Vue.component(component.name, component);
  })
  // 遍历注册全局方法
  methods.map(method=> {
    Vue.use(method);
  });
  // 遍历注册全局过滤器
  filters.map(filter=> {
    Vue.use(filter);
  });
  // 遍历注册全局指令
  directives.map(directive=> {
    Vue.use(directive);
  });
  install.install = true;
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  Button
}