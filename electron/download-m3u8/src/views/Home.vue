<template>
  <div>
    <el-form :model="form" ref="refForm" :rules="rules" label-width="auto">
      <el-form-item label="视频地址" prop="url">
        <el-input v-model="form.url" :disabled="bDisabled" style="width: 100%;"/>
      </el-form-item>
      <el-form-item label="保存目录" prop="path">
        <div style="display: flex;justify-content: space-between;width: 100%;gap: 20px;">
          <el-input v-model="form.path" :disabled="true" type="text" style="width: 100%;"/>
          <el-button type="primary" :disabled="bDisabled" @click="onSelectDirectory">选择下载目录</el-button>
        </div>
      </el-form-item>
      <el-form-item label="视频名" prop="fileName">
        <el-input v-model="form.fileName" :disabled="bDisabled" style="width: 100%;"/>
      </el-form-item>
    </el-form>
    <div class="btn-wrap">
      <div class="process-wrap">
        <div class="inner" :style="{width: form.processVal+'%'}"></div>
        <span>{{ form.processVal }}%</span>
      </div>
      <el-button type="primary" :disabled="form.btnDisabled" @click="onDownload">{{ form.btnText }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import useLoadingStore from '../store/loading';
import { ElMessage } from 'element-plus';

const loadingSotate = useLoadingStore();

const bDisabled= ref(false);
const refForm = ref(null);
const form = reactive({
  url: '',
  path: '',
  fileName: '',
  processVal: 0,
  btnText: '下载',
  btnDisabled: false
});
const rules = {
  url: [
    { required: true, message: '请输入视频源地址', trigger: 'blur' }  
  ],
  path: [
    { required: true, message: '请选择保存文件目录', trigger: ['blur', 'change'] } 
  ],
  fileName: [
    { required: true, message: '请输入保存视频名', trigger: ['blur', 'change'] }
  ]
}
const onDownload = ()=> {
  if(form.btnText==='下载重置') {
    form.btnText = '下载';
    bDisabled.value = false;
    form.url = '';
    form.path = '';
    form.fileName = '';
    form.processVal = 0;
    refForm.value.resetFields();
    return ;
  }
  refForm.value.validate(async valid=> {
    if(valid) {
      bDisabled.value = true;
      form.btnDisabled = true;
      await rendererApi.download(JSON.stringify(form));
    }
  });
}
onMounted(async ()=> {
  await rendererApi.selectDirectoryCallback((value)=> {
    form.path = value;
  });

  await rendererApi.downloadCallback((data)=> {
    // console.log(data);
    if(data.type==='parse') {
      ElMessage.success('地址解析完成，准备下载...');
    }else if(data.type==='process') {
      form.processVal = +data.value;
    }else if(data.type==='success') {
      form.processVal = 100;
      form.btnText = '下载重置';
      form.btnDisabled = false;
    }else if(data.type==='combinStart') {
      ElMessage.success('视频文件已加载到本地，正在和并生成MP4文件...');
    }else if(data.type==='combinEnd') {
      ElMessage.success('已生成MP4文件');
    }

  });
});

const onSelectDirectory = async ()=> {
  await rendererApi.selectDirectory();
}
</script>

<style lang="stylus" scoped>
.btn-wrap {
  text-align: right;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  .process-wrap {
    position relative;
    flex: 1;
    background: #cccccc;
    border-radius: 3px;
    overflow hidden;
    .inner {
      width: 50%;
      background: #0e81bb;
      height: 30px;
    }
    span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      line-height: 30px;
      color: #fff;
    }
  }
}
</style>
