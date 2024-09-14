<template>
  <div class="layout-wrap">
    <Header></Header>
    <div class="content-wrap">
      <Editor></Editor>
      <Preview></Preview>
      <Console></Console>
    </div>
  </div>
</template>

<script setup>
import Console from './Console.vue';
import Editor from './Editor.vue';
import Header from './Header.vue';
import Preview from './Preview.vue';
</script>

<style lang="less" scoped>
.content-wrap {
  height: calc(100vh - 48px);
  overflow-y: auto;
}
</style>
