<template>
  <button :class="clsStyle" @click="onClickHandler" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'nux-button',
  props: {
    type: String, // button类型
    disabled: { // 是否可点击
      type: Boolean,
      default: false
    }
  },
  computed: {
    clsStyle() {
      let cls = `nux-button 
                ${
                  this.type==='primary'?'nux-button-primary':
                  this.type==='success'?'nux-button-success':
                  this.type==='info'?'nux-button-info':
                  this.type==='warn'?'nux-button-warn':
                  this.type==='error'?'nux-button-error':''
                }`;
      return cls;
    }
  },
  methods: {
    onClickHandler(evt) {
      if (this.disabled) {
        return;
      }
      this.$emit('click', event);
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../styles/base.scss';
.nux-button {
  display: inline-block;
  padding: 3px 10px; /*no*/
  background: #ffffff;
  color: #000000;
  border: 1px solid $border-color; /*no*/
  border-radius: $border-radius; /*no*/
  &:focus {
    outline: none;
  }
  &:active {
    opacity: .7;
  }
}
.nux-button-primary {
  background: $primary-color;
  color: #ffffff;
}
.nux-button-success {
  background: $success-color;
  color: #ffffff;
}
.nux-button-info {
  background: $info-color;
  color: #ffffff;
}
.nux-button-warn {
  background: $warn-color;
  color: #ffffff;
}
.nux-button-error {
  background: $error-color;
  color: #ffffff;
}
</style>