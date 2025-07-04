<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const query = route.query;
</script>

<template>
  <div>
    <div class="go-back">
      <el-button type="primary" @click="router.go(-1)">返回</el-button>
    </div>
    <h1>{{ query.title }}</h1>
    <div>来自-{{ query.city }}</div>
    <pre>{{ query.desc }}</pre>
  </div>
</template>

<style lang="stylus" scoped>
.go-back {
  text-align: right;
}
</style>
