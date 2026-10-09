<script setup lang="ts">
import { ref } from "vue";
import LoginView from "./components/LoginView.vue";
import NotesView from "./components/NotesView.vue";
import { useTheme } from "./composables/useTheme";

const { initTheme } = useTheme();
initTheme();

const authed = ref(false);
</script>

<template>
  <Transition name="fade" mode="out-in">
    <LoginView v-if="!authed" key="login" @login="authed = true" />
    <NotesView v-else key="notes" @logout="authed = false" />
  </Transition>
</template>