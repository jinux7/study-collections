<script setup>
</script>
<template>
  <div class="header-container">
    <router-link to="/home" custom v-slot="{ isActive, navigate }">
      <div :class="{active: isActive}" @click="navigate">
        网站收藏
      </div>
    </router-link>
    <router-link to="/imageGallery" custom v-slot="{ isActive, navigate }">
      <div :class="{active: isActive}" @click="navigate">
      图片收藏
    </div>
    </router-link>
  </div>
</template>
<style lang="stylus">
.header-container {
  display: flex;
  background-color: #1e90ff;
  height: 44px;
  div {
    padding-left: 10px;
    padding-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #cccccc;
    cursor: pointer;
    &.active {
      color: #ffffff;
    }
    svg {
      margin-right: .2rem;
      fill: #cccccc;
    }
    &.active svg {
      fill: #ffffff;
    }
  }
}
</style>