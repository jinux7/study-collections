export const templateCode = {
  html: `<div id="app">hello world</div>`,
  javascript: `const count = 1`,
  css: 
  `#app {
    color: red;    
  }`,
  vue: 
  `<template>
    <h1>{{ msg }}</h1>
    <input v-model="msg">
  </template>

  <script setup>
  import { ref, createApp } from 'vue'
  
  const msg = ref('Hello World!')
  </script>

  <style>
  h1 {
      color: blue;
  }
  </style>`,
}

export const languageMap = {
  'html': 'htmlContent',
  'javascript': 'javascriptContent',
  'css': 'cssContent',
  'vue': 'vueContent',
}