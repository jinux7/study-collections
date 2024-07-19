<script setup>
import { inject, ref, watch, nextTick } from 'vue'
import useWebsiteStore from '../store/websiteStore';

const refInput = ref();
const isSubmit = ref(false);
const websiteStore = useWebsiteStore();
const { isShow, setIsShow } = inject('dialog-visible');
const { url } = inject('dialog-url');
const handleAddClick = async ()=> {
  if(url.value==='') {
    alert('地址不能为空');
    return ;
  }
  try {
    isSubmit.value = true;
    let result = await myApi.sendUrl(url.value);
    websiteStore.add(result);  
  } catch (error) {
    myApi.alert('输入的网址有误');   
  }finally {
    isSubmit.value = false;
    setIsShow(false);
  } 
}
// input focus
watch(isShow, (newValue, oldValue) => {
  if(newValue) {
    nextTick(()=> {
      refInput.value.focus();
    });
  }
});

</script>

<template>
  <div class="dialog-wrap" v-if="isShow">
    <div class="content">
      <div class="input">
        <input ref="refInput" type="text" v-model="url" @keyup.enter="handleAddClick" placeholder="请输入网址..." :disabled="isSubmit"> 
      </div>
      <div class="btns">
        <button @click="handleAddClick" :disabled="isSubmit">添加</button>
        <button @click="setIsShow(false)" :disabled="isSubmit">取消</button>
      </div>
    </div>
  </div>
</template>
<style lang="stylus">
.dialog-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  .content {
    width: 100%;
    padding: 0 20px;
    input {
      height: 30px;
      width: 100%;
      outline: none;
      margin-bottom: 10px;
      font-size: 12px;
      .btns {
        button {
          height: 30px;
          margin-right: 10px;
          font-size: 12px;
          padding: 0 20px;
        }
      }
    }
  }
}
</style>