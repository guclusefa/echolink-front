import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import HomeView from '../views/HomeView.vue';
import ChatView from '../views/ChatView.vue';

import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';

import SignalementsView from '../views/signalements/SignalementsView.vue';
import SignalementView from '../views/signalements/SignalementView.vue';
import CreateSignalementView from '../views/signalements/CreateSignalementView.vue';
import EditSignalementView from '../views/signalements/EditSignalementView.vue';

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
    // Signalements
    {
      path: '/signalements',
      name: 'signalements',
      component: SignalementsView
    },
    {
      path: '/signalements/create',
      name: 'create-signalement',
      component: CreateSignalementView,
      meta: { requiresAuth: true }
    },
    {
      path: '/signalements/:id',
      name: 'signalement',
      component: SignalementView
    },
    {
      path: '/signalements/:id/edit',
      name: 'edit-signalement',
      component: EditSignalementView,
      meta: { requiresAuth: true }
    },
    // Chat
    {
      path: '/chat/:id',
      name: 'chat',
      component: ChatView,
      props: true,
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  setDocumentTitle(String(to.name));
  
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token && !!authStore.user;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
