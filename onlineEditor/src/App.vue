<template>
  <div>
    <Layout></Layout>
  </div>
</template>

<script setup>
import Layout from './pages/Layout.vue';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

window.addEventListener('message', (ev) => {
  if(ev.data.type === 'console') {
    proxy.$store.consoleContent.push(ev.data);
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
