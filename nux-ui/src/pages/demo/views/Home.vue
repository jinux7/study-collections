<template>
  <div id="home">
    <h1>Home页面</h1>
    <router-link to="/About">to-about</router-link>
    <div>
      <nux-button type="" style="margin:5px;" @click="onPopMsgClick">popMsg按钮</nux-button>
      <nux-button type="primary" @click="onMessageClick">message按钮</nux-button>
      <nux-button type="primary" @click="onConfirmClick">confirm按钮</nux-button>
      <h3>{{'abcdef' | capitalize}}</h3>
      <p v-base-directive:foo.a.b="baseData">base</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      show: true,
      baseData: 'v-base'
    }
  },
  components: {
  },
  mounted() {
  },
  methods: {
    onPopMsgClick() {
      this.$popMsg('pop消息');
    },
    onMessageClick() {
      this.$message({
        title: '提示',
        text: '消息提示框',
        // okBtnTxt: '知道了',
      }); 
    },
    onConfirmClick() {
      this.$confirm({
        title: '提示',
        text: '消息提示框',
        callBack() {
          console.log('您点击了是按钮');
        }
      }); 
    },
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    font-size: 14px;
  }
  .home-div {
    width: 375px;
    height: 20px;
    background: red;
  }
</style>
