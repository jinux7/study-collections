<template>
  <div class="header-wrap">
    <h3>online-editor</h3>
    <div class="btns">
      <el-button type="primary" size="mini" @click="onRun">运行</el-button>
      <el-select
        v-model="$store.languageType"
        placeholder="Select"
        size="mini"
        @change="onLanguageChange"
        style="width: 100px; margin-left: 10px;"
      >
        <el-option
          v-for="item in mainData.languageList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive } from 'vue';

const { proxy } = getCurrentInstance();
const mainData = reactive({
  lang: 1,
  languageList: [
    { label: 'vanilla', value: 1 },
    { label: 'vue', value: 2 },
  ],
})

const onRun = ()=> {
  // proxy.$store.iframeShow = false;
  if(proxy.$store.languageType===1) {
    proxy.$store.docContent = createHtml(proxy.$store.htmlContent, proxy.$store.javascriptContent, proxy.$store.cssContent);
  }else if(proxy.$store.languageType===2) {
    proxy.$store.docContent = createVue(proxy.$store.vueContent);
  }
  nextTick(()=> {
    // proxy.$store.iframeShow = true;
  });
}

const createHtml = (htmlStr='', jsStr='', cssStr='')=> {
  if(proxy.$store.languageType===1) {
    let head = `
      <title>预览<\/title>
      <style type="text/css">
          ${cssStr}
      <\/style>
    `;
    let jsContent = `
      <script>
        ${jsStr}
      <\/script>
    `;
    let body = `
      ${htmlStr}
      ${jsContent}
    `;
    return `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8" />
          ${head}
      <\/head>
      <body>
          ${body}
      <\/body>
      <\/html>
    `;
  }else if(proxy.$store.languageType===2) {

  }
}

const createVue = (sfcStr)=> {
  return `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" \/>
          <title>预览<\/title>
        <\/head>
        <body>
          <script src="/onlineEditor/lib/vue.runtime.global.prod.js"><\/script>
          <script src="/onlineEditor/lib/vue3-sfc-loader.js"><\/script>
          <script>
            /* <!-- */
            const config = {
              files: {
                '\/main.vue': \`${sfcStr}\`,
              }
            };
            /* --> */

            const options = {
              devMode: true,
              moduleCache: {
                vue: Vue,
              },
              async getFile(url) {
                
                if ( config.files[url] )
                  return config.files[url];
                
                const res = await fetch(url);
                if ( !res.ok )
                  throw Object.assign(new Error(res.statusText + ' ' + url), { res });
                return {
                  getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
                }
              },

              addStyle(textContent) {

                const style = Object.assign(document.createElement('style'), { textContent });
                const ref = document.head.getElementsByTagName('style')[0] || null;
                document.head.insertBefore(style, ref);
              },

              handleModule: async function (type, getContentData, path, options) {

                switch (type) { 
                  case '.png':
                    return getContentData(true);
                } 
              },

              log(type, ...args) {

                console[type](...args);
              }
            }

            const app = Vue.createApp(Vue.defineAsyncComponent(() => window['vue3-sfc-loader'].loadModule('/main.vue', options)))
            app.mount(document.body);

          <\/script>
        <\/body>
      <\/html>`;
}

const onLanguageChange = ()=> {
  proxy.$store.docContent = createHtml();
}
</script>

<style lang="less" scoped>
.header-wrap {
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  h3 {
  }
}
</style>
