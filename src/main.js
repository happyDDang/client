import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index';

import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App).use(Vue3Toastify, {
  autoClose: 3000,
});
const pinia = createPinia();

app.use(pinia);
app.use(router).mount('#app');
