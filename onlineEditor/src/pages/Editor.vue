<template>
  <div class="editor-wrap">
    <div v-if="$store.languageType===1">
      <div ref="refHtml" class="html-wrap">html</div>
      <div ref="refJs" class="js-wrap">js</div>
      <div ref="refCss" class="css-wrap">css</div>
    </div>
    <div v-else ref="refVue" class="vue-wrap">vue</div>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, watch, nextTick } from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { languageMap } from '@/config/constants'

const { proxy } = getCurrentInstance();
const refHtml = ref(null);
const refJs = ref(null);
const refCss = ref(null);
const refVue = ref(null);
const editorArr = [];
const createEditor = async (el, language) => {
  const editor = monaco.editor.create(el, {
    model: null,
    minimap: {
      enabled: false // 关闭小地图
    },
    wordWrap: 'on', // 代码超出换行
    theme: 'vs-dark', // 主题
    fontSize: 14,
    fontFamily: 'Microsoft YaHei',
    contextmenu: false, // 不显示右键菜单
    fixedOverflowWidgets: true, // 让语法提示层能溢出容器
    readOnly: false
  })
  // 设置文档内容
  updateDoc(editor, proxy.$store[languageMap[language]], language)
  // 支持textMate语法解析
  // wire(language, editor)
  // 监听编辑事件
  editor.onDidChangeModelContent(() => {
    // console.log('code-change', editor.getValue())
    proxy.$store[languageMap[language]] = editor.getValue();
  })
  // 监听失焦事件
  editor.onDidBlurEditorText(() => {
    // console.log('blur', editor.getValue())
  })

  // editor添加入数组保存
  editorArr.push(editor);
}

// 更新编辑器文档模型
const updateDoc = (editor, code, language) => {
  language = language==='vue'?'html':language;
  let oldModel = editor.getModel();
  let newModel = monaco.editor.createModel(code, language);
  editor.setModel(newModel);
  if (oldModel) {
    oldModel.dispose();
  }
}

onMounted(()=> {
});

watch(()=> proxy.$store.languageType, async ()=> {
  if(proxy.$store.languageType===1) {
    await nextTick(()=> {
      createEditor(refHtml.value, 'html');
      createEditor(refJs.value, 'javascript');
      createEditor(refCss.value, 'css');
    });
  }else if(proxy.$store.languageType===2) {
    await nextTick(()=> {
      createEditor(refVue.value, 'vue');
    });
  }
}, { immediate: true });

</script>

<style lang="less" scoped>
.editor-wrap {
  .html-wrap, .js-wrap, .css-wrap, .vue-wrap {
    min-height: 30vh;
    border: 1px solid #eeeeee;
    margin: 5px;
  }
  .vue-wrap {
    min-height: 50vh;
  }
}
</style>
