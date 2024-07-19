<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const props = defineProps(['listData']);
const emit = defineEmits(['get-list']);

const onGotoDetail = item=> {
  const params = {
    title: item.title,
    city: item.city,
    desc: item.desc
  }
  router.push({
    name: 'detail',
    query: params
  });
}
const onDel = item=> {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    callback: async (action) => {
      if(action==='confirm') {
        await rendererApi.delText(JSON.stringify(item));
        emit('get-list');
      }
    },
  })
}
</script>

<template>
  <div class="list-wrap">
    <div v-if="listData.length===0">暂无数据</div>
    <ul v-else>
      <li v-for="item in props.listData" @click="onGotoDetail(item)">
        <div>
          <h3>{{ item.title }} - {{ item.city }}</h3>
          <pre>{{ item.desc }}</pre>
        </div>
        <el-button class="btn" type="danger" @click.stop="onDel(item)">删除</el-button>
      </li>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
.list-wrap {
  height: calc(100vh - 150px);
  overflow-y: auto;
  >div {
    text-align: center;
    line-height: 50px;
    font-size: 20px;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      border-bottom: 1px solid #cccccc;
      margin-bottom: 10px;
      padding: 0 10px 10px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }
  }
}
</style>
