import { createSSRApp } from "vue";
import App from './App.vue'

export default function myCreateApp(){
  const app = createSSRApp(App);
  return app;
}
