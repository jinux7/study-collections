<script setup>
  import { onMounted, ref } from 'vue'; 
  import SearchBar from './SearchBar.vue'
  import Dialog  from './Dialog.vue'
  import List from './list/List.vue'

  const searchbarRef = ref(null);
  onMounted(async ()=> {
    myApi.openDialog();
    myApi.onRendererEvent(cb);
  });

  const cb = ()=> {
    searchbarRef.value.handleClick();
  }
</script>

<template>
  <main>
    <SearchBar ref="searchbarRef"></SearchBar>
    <Teleport to="body">
      <Dialog></Dialog>
    </Teleport>
    <List></List>
  </main>
</template>