<script setup>
import useLoadingStore from '../store/loading';

const loadingState = useLoadingStore();
</script>

<template>
  <div class="loading-wrap" v-if="loadingState.getBShow">
    <svg class="circular" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none"></circle></svg>
  </div>
</template>

<style lang="stylus" scoped>
.loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .8);
  display: flex;
  justify-content: center;
  align-items: center;
  .circular {
    stroke: #000000;
    width: 50px;
    height: 50px;
    animation: loading-rotate .5s linear infinite alternate;
  }
}
@keyframes loading-rotate {
  0% {
    transform: scale(1);
    opacity: 0
  }
  100% {
    transform: scale(1.2);
    opacity: 1
  }
}
</style>
