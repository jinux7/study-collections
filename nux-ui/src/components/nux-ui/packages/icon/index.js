import Icon from './icon.vue'
import './assets/iconfont.css'
Icon.install = function (Vue) {
  Vue.component(Icon.name, Icon)
}
export default Icon