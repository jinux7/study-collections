<template>
  <div class="preview-wrap" v-loading="$store.loading">
    <p>预览</p>
    <iframe v-if="$store.iframeShow" :srcdoc="$store.docContent" :key="$store.docContent"></iframe>
  </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.preview-wrap {
  height: 50vh;
  border: 1px solid #eeeeee;
  margin: 5px;
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
