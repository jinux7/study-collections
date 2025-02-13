<template>
  <div>
    <div class="nav-wrap">
      <span @click="onGo('/')" :class="route.path==='/'?'active':''">首页</span>
      <span @click="onGo('/about')" :class="route.path==='/about'?'active':''">关于页</span>
    </div>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const onGo = (path) => {
  router.push(path);
}
</script>
<style lang="css">
h1 {
  text-align: center;
}
</style>
<style lang="css" scoped>
.nav-wrap {
  margin: 20px 0;
  span {
    margin: 20px;
    cursor: pointer;
  }
  span.active {
    font-weight: bold;
    color: rgb(11, 146, 170);
  }
}
</style>

