<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import useLoadingStore from '../store/loading';
import List from './List.vue';

const loadingSotate = useLoadingStore();

const dialogVisible = ref(false);
const list = ref([]);
const refForm = ref(null);
const form = reactive({
  title: '',
  city: '',
  desc: '',
});
const rules = {
  title: [
    { required: true, message: '请输入题目', trigger: 'blur' }  
  ],
  city: [
    { required: true, message: '请选择城市', trigger: 'change' }  
  ],
  desc: [
    { required: true, message: '请输入描述', trigger: 'blur' }  
  ]
}
const onAdd = ()=> {
  dialogVisible.value = true;
  nextTick(()=> {
    refForm.value.resetFields();
  });
}
const sunmitHandle = ()=> {
  refForm.value.validate(async valid=> {
    if(valid) {
      dialogVisible.value = false;
      loadingSotate.set(true);
      // 调用渲染进程提供的方法
      await rendererApi.saveText(JSON.stringify(form));
      loadingSotate.set(false);
      getList();
    }
  });
}
const getList = async ()=> {
  list.value = await rendererApi.getText();
}
// 主进程调用vue侧的函数
rendererApi.showAddDialog(()=> {
  onAdd();
});
onMounted(async ()=> {
  getList();
});
</script>

<template>
  <div>
    <div>
      <el-button type="primary" @click="onAdd">+</el-button>
    </div>
    <List :listData="list" @get-list="getList"></List>
    <el-dialog
      v-model="dialogVisible"
      title="添加内容"
      width="80%"
    >
    <el-form :model="form" ref="refForm" :rules="rules" label-width="auto">
      <el-form-item label="题目" prop="title">
        <el-input v-model="form.title" style="width: 100%;"/>
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-select v-model="form.city" placeholder="请选择城市" style="width: 100%;">
          <el-option label="沈阳" value="沈阳" />
          <el-option label="大连" value="大连" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.desc" type="textarea" :rows="10" style="width: 100%;"/>
      </el-form-item>
    </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="sunmitHandle">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="stylus" scoped>
</style>
