import Message from './message.vue';

Message.install = function (Vue) {
  Vue.prototype.$message = function (options={}) {
    let oldEle = document.getElementById('nux-message-modal');
    if(oldEle) document.body.removeChild(oldEle);
    let NewCom = new Vue(Object.assign({}, Message, {
      propsData: {
        title: options.title || '',
        text: options.text || '',
        okBtnTxt: options.okBtnTxt || '',
        callBack: options.callBack || function() {}
      }
    }))
    document.body.appendChild(NewCom.$mount().$el)
  }
}
export default Message