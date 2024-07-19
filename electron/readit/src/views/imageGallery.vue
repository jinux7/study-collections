<script setup>
  import { onMounted, ref } from 'vue';

  const filelist = ref([]);
  onMounted(async ()=> {
    const files = await myApi.getFilelist();
    filelist.value = files;
  });
</script>

<template>
  <div class="img-container">
    <img v-for="item in filelist" :src="`/uploads/${item}`" :key="item" alt="">
  </div>
</template>
<style lang="stylus">
  .img-container {
    padding: 20px;
    img {
      width: 150px;
      margin: 0 10px;
    }
  }
</style>