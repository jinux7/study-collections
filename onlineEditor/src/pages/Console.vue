<template>
  <div class="console-wrap">
    <p>Console Panel</p>
    <div class="console-item" :class="item.method" v-for="(item, index) in $store.consoleContent">
      {{ item.data }}
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
.console-wrap {
  height: 30vh;
  border: 1px solid #eeeeee;
  margin: 5px;
  overflow-y: auto;
  .console-item {
    margin: 5px 10px;
  }
  .error {
    color: red;
  }
}
</style>
