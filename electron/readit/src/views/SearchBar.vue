<script setup>
import { inject, defineExpose } from 'vue'
import _ from 'lodash'

const { setIsShow } = inject('dialog-visible');
const { setUrl } = inject('dialog-url');
const { setKeywords } = inject('searchbar-keywords');
const handleClick = ()=> {
  setIsShow(true);
  setUrl('');
}

const search = _.debounce((e)=> {
  setKeywords(e.target.value);
}, 500);

defineExpose({
  handleClick
});
</script>

<template>
 <div class="search-container">
  <div class="button" @click="handleClick">+</div>
  <div class="input">
    <input type="text" placeholder="请输入关键字..." @keyup="search">
  </div>
 </div>
</template>
<style lang="stylus">
.search-container {
  height: 60px;
  background: #d3d3d3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  .button {
    width: 40px;
    height: 40px;
    background-color: #1e90ff;
    padding-left: 0;
    border-radius: 5px;
    font-size: 30px;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
    cursor: default;
  }
  .input {
    flex: 1;
    height: 30px;
    padding: 0 10px;
    border: solid 1px #cccccc;
    border-radius: 5px;
    input {
      height: 100%;
      width: 100%;
      border-radius: 5px;
      padding: 0 10px;
      outline: none;
    }
  }
}
</style>