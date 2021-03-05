import PopMsg from './popmsg';

PopMsg.install = function (Vue) {
  Vue.prototype.$popMsg = function (text) {
    let NewCom = new Vue(Object.assign({}, PopMsg, {
      propsData: {
        text: text || '',
      }
    }));
    let nWrap = document.querySelector('#nux-popmsg-modal-wrap'); 
    if(!nWrap) {
      nWrap = document.createElement('div');
      nWrap.setAttribute('id', 'nux-popmsg-modal-wrap');
      document.body.appendChild(nWrap);
    }
    nWrap.appendChild(NewCom.$mount().$el)
  }
}
export default PopMsg