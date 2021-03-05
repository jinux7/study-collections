import Confirm from './confirm';

Confirm.install = function (Vue) {
  Vue.prototype.$confirm = function (options={}) {
    let oldEle = document.getElementById('nux-confirm-modal');
    if(oldEle) document.body.removeChild(oldEle);
    let NewCom = new Vue(Object.assign({}, Confirm, {
      propsData: {
        title: options.title || '',
        text: options.text || '',
        callBack: options.callBack || function() {}
      }
    }))
    document.body.appendChild(NewCom.$mount().$el)
  }
}
export default Confirm