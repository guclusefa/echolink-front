import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';

import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';

import SignalementsView from '../views/signalements/SignalementsView.vue';
import SignalemenView from '../views/signalements/SignalementView.vue';

import { setDocumentTitle } from '@/utils/document';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    // AUTH
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    // Signalement
    {
      path: '/signalements',
      name: 'signalements',
      component: SignalementsView
    },
    {
      path: '/signalements/:id',
      name: 'signalement',
      component: SignalemenView
    }
  ]
});

router.beforeEach((to, from, next) => {
  setDocumentTitle(String(to.name));
  next();
});

export default router;
