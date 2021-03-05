<template>
  <div id="about">
    <h1>about页面</h1>
    <router-link to="/home">to-home</router-link>
    <p class="home-div"></p>
  </div>
</template>

<script>
export default {
  name: 'about',
  components: {
  }
}
</script>

<style lang="scss">
.home-div {
  width: 375px;
  height: 20px;
  background: red;
}
</style>
