<template>
  <div id="nux-message-modal" class="nux-message-modal">
    <div class="nux-message-modal-content">
      <div class="nux-message-modal-title">{{title}}</div>
      <div class="nux-message-modal-text" v-html="text"></div>
      <div class="nux-message-modal-btns">
        <span class="yes" @click="onYes">{{okBtnTxt || nutTranslate('lang.message.okBtnTxt')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import locale from '../../mixins/locale'
  export default {
    name: 'nux-message',
    data() {
      return {
        
      }
    },
    mixins: [locale],
    props: ['title', 'text', 'callBack', 'okBtnTxt'],
    directives: {
      
    },
    components: {
    },
    computed: {
      
    },
    created () {
      document.querySelector('body').style.position = 'fixed';
    },
    destroyed() {

    },
    mounted () {
     
    },
    methods: {
      onYes() {
        this.destroyComponent();
        this.callBack();
      },
      onNo() {
        this.destroyComponent();
      },
      destroyComponent() {
        document.body.removeChild(this.$el);
        document.querySelector('body').style.position = 'relative';
      },
    },
  }
</script>

<style scoped  lang="scss">
.nux-message-modal {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.7);
  .nux-message-modal-content {
    width: 314px; /*no*/
    background-color: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px; /*no*/
    .nux-message-modal-title {
      line-height: 50px; /*no*/
      text-align: center;
      font-size: 17px; /*no*/
    }
    .nux-message-modal-text {
      margin: 10px 0 30px; /*no*/
      padding: 0 30px;
      text-align: center;
      font-size: 15px; /*no*/
      color: #333333;
      p {
        text-align: left;
      }
    }
    .nux-message-modal-btns {
      margin: 20px 10px; /*no*/
      text-align: center;
      span {
        display: inline-block;
        width: 260px; /*no*/
        height: 40px; /*no*/
        line-height: 40px; /*no*/
        text-align: center;
        color: #ffffff;
        background-color: #3a8dff;
        border-radius: 20px; /*no*/
      }
    }
  }
}
</style>
