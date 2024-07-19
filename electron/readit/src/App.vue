<script setup>
  import { provide, ref } from 'vue';
  import Header from '@/views/Header.vue';
  // 窗口显示的状态
  const isShow = ref(false)
  const setIsShow= (value)=> {
    isShow.value = value 
  }
  provide('dialog-visible', {
    isShow,
    setIsShow
  });

  // dialog url
  const url = ref('');
  const setUrl = value=> {
    url.value = value;
  }
  provide('dialog-url', {
    url,
    setUrl
  });

  // searchbar keywords
  const keywords = ref('');
  const setKeywords = value=> {
    keywords.value = value;
  }
  provide('searchbar-keywords', {
    keywords,
    setKeywords
  });
</script>

<template>
  <div>
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<style scoped>

</style>
