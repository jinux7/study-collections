<script setup>
import { ref } from 'vue';
// 引入hook函数
import useWebsites from './useWebsites';
import useIndex from './useIndex';

const { websiteStore, keywords } = useWebsites();
const { currentIndex, handleItemClick } = useIndex();
const handleDelClick = ()=> {
  websiteStore.deleteItem(ws.url);
  currentIndex.value = 0;
}
</script>

<template>
  <div>
    <p id="no-item" v-if="websiteStore.find(keywords).length===0">暂无数据.</p>
    <div id="items" v-else>
      <div class="read-item" :class="{selected: currentIndex===i}" v-for="(ws, i) in websiteStore.find(keywords)" @click="handleItemClick(i, ws.url)">
        <img :src="ws.screenshot" :alt="ws.title">
        <h2>{{ ws.title }}</h2>
        <button @click.stop="handleDelClick(ws)">X</button>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
#no-item {
  font-weight: bold;
  color: silver;
  text-align: center;
  position: absolute;
  top: 100px;
  z-index: -1;
}
#items {
  .read-item {
    display: flex;
    align-items: center;
    align-content: center;
    border-bottom: loghtgray 2px solid;
    background-color: #fafafa;
    border-left: 10px solid lightgray;
    -webkit-user-select: none;
    position: relative;
    padding: 10px;
    img {
      width: 20%;
      margin-right: 25px;
      border: solid 1px #cccccc;
    }
    &:hover {
      background-color: #eeeeee;
    }
    &:hover button {
      display: inline-block;
    }
    &.selected {
      border-left-color: dodgerblue;
    }
    button {
      position: absolute;
      display: none;
      right: 10px;
      top: 10px;
      width: 30px;
      height: 30px;
      background-color: #f44336;
      border: none;
      border-radius: 50%;
      color: #ffffff;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>