<template>
  <div id="nux-confirm-modal">
    <div class="nux-confirm-modal-content">
      <div class="nux-confirm-modal-title">{{title}}</div>
      <div class="nux-confirm-modal-text">{{text}}</div>
      <div class="nux-confirm-modal-btns">
        <span class="nux-confirm-modal-yes" @click="onYes">{{nutTranslate('lang.confirm.yesBtnTxt')}}</span>
        <span class="nux-confirm-modal-no" @click="onNo">{{nutTranslate('lang.confirm.noBtnTxt')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import locale from '../../mixins/locale'
export default {
  name: 'app',
  data () {
    return {
      
    }
  },
  props: ['title', 'text', 'callBack'],
  mixins: [locale],
  created () {
    document.querySelector('body').style.position = 'fixed';
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
#nux-confirm-modal {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.7);
  .nux-confirm-modal-content {
    width: 314px; /*no*/
    background-color: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px; /*no*/
    .nux-confirm-modal-title {
      line-height: 50px; /*no*/
      text-align: center;
      font-size: 17px; /*no*/
    }
    .nux-confirm-modal-text {
      padding: 0 20px; /*no*/
      text-align: center;
      font-size: 15px; /*no*/
    }
    .nux-confirm-modal-btns {
      margin: 20px 10px 0px; /*no*/
      border-top: 1px solid #dddddd;
      display: flex;
      span {
        width: 50%; /*no*/
        text-align: center;
        font-size: 16px; /*no*/
        line-height: 30px; /*no*/
        margin: 10px 0; /*no*/
        color: #919191;
      }
      .nux-confirm-modal-yes {
        border-right: 1px solid #dddddd; /*no*/
      }
      .nux-confirm-modal-no {
        color: #125bc9; /*no*/
      }
    }
  }
}
</style>
