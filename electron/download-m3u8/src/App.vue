<script setup>
import Loading from '@/views/Loading.vue';
</script>

<template>
  <div id="app-wrap">
    <h1>M3U8电影资源下载</h1>
    <router-view></router-view>
    <Teleport to="body">
      <Loading></Loading>
    </Teleport>
  </div>
</template>

<style lang="stylus" scoped>
#app-wrap {
  padding: 10px 20px;
}
</style>
