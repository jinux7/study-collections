<template>
  <div id="app">
    <h1>欢迎光临</h1>
    <!-- <keep-alive> -->
      <!-- 需要缓存的视图组件 --> 
      <!-- <router-view v-if="$route.meta.keepAlive"></router-view> -->
    <!-- </keep-alive> -->
      <!-- 不需要缓存的视图组件 -->
    <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  h1 {
    font-size: 18px;
  }
}
</style>
