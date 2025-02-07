import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router).mount('#app');

app.component('font-awesome-icon', FontAwesomeIcon);
