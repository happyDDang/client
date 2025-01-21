import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/index.vue';
import RankPage from '../pages/rank.vue';

let router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/rank',
      name: 'RankPage',
      component: RankPage,
    },
  ],
});

export default router;
