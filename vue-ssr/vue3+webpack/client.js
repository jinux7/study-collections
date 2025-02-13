import { createApp } from "vue";
import App from './App.vue';
import { createWebHistory } from "vue-router";
import createRouter from "./router/index";

const app = createApp(App);
const router = createRouter(createWebHistory());
app.use(router);
router.isReady().then(() => {
  app.mount('#app');
})
