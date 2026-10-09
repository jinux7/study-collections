<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{ login: [] }>();

const username = ref("");
const password = ref("");
const error = ref("");
const shaking = ref(false);

function submit() {
  if (username.value.trim() === "admin" && password.value === "123456") {
    error.value = "";
    emit("login");
  } else {
    error.value = "用户名或密码错误";
    shaking.value = true;
  }
}
</script>

<template>
  <div id="login-view" class="view">
    <div class="login-card">
      <div class="login-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
          <path d="M8 2v20" />
          <path d="M12 8h5M12 12h5M12 16h5" />
        </svg>
      </div>
      <h1 class="login-title">云笔记</h1>
      <p class="login-subtitle">登录以管理你的笔记</p>
      <form
        id="login-form"
        :class="{ shake: shaking }"
        autocomplete="off"
        @submit.prevent="submit"
        @animationend="shaking = false"
      >
        <label class="field">
          <span class="field-label">用户名</span>
          <input v-model="username" type="text" placeholder="请输入用户名" autocomplete="username" />
        </label>
        <label class="field">
          <span class="field-label">密码</span>
          <input v-model="password" type="password" placeholder="请输入密码" autocomplete="current-password" />
        </label>
        <p class="login-error" role="alert">{{ error }}</p>
        <button type="submit" class="btn btn-primary btn-block">登 录</button>
      </form>
      <p class="login-hint">默认账号 admin / 123456</p>
    </div>
  </div>
</template>