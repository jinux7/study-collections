<template>
  <div id="home">
    <h1>Home页面</h1>
    <router-link to="/About">to-about</router-link>
    <div class="home-div"></div>
    <nut-button
      type="primary" 
      shape="circle" 
      small
    >
      京东快递
    </nut-button>
    <nut-popup :style="{ padding: '30px 50px' }" v-model="show">正文</nut-popup>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      show: true,
    }
  },
  components: {
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
</style>>
