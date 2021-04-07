<template>
  <div class="nux-popmsg-modal">
    <div class="nux-popmsg-modal-content">
      <div class="nux-popmsg-modal-text" v-html="text"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        
      }
    },
    props: ['text'],
    mounted () {
      setTimeout(() => {
        this.destroyComponent();
      }, 3000);
    },
    methods: {
      destroyComponent() {
        document.querySelector('#nux-popmsg-modal-wrap').removeChild(this.$el);
      },
    },
  }
</script>

<style lang="scss">
#nux-popmsg-modal-wrap {
  position: fixed;
  z-index: 999;
  top: 20px; /*no*/
  left: 50%;
  transform: translateX(-50%);
  .nux-popmsg-modal {
    margin-top: 3px; /*no*/
    border-radius: 10px; /*no*/
    width: 200px; /*no*/
    height: 40px; /*no*/
    line-height: 40px; /*no*/
    background-color: #ffffff;
    border: 1px solid #cccccc; /*no*/
    animation: popmsganimation 1s forwards;
    .nux-popmsg-modal-content {
      padding: 0 10px; /*no*/
      .nux-popmsg-modal-text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: red;
        text-align: center;
        font-size: 13px;
      }
    }
  }
  @keyframes popmsganimation
  {
      from { 
        opacity: 0; 
      }
      to {
        opacity: 1;
      }
  }
}
</style>
