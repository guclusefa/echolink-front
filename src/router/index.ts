import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';

import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';

import MembersView from '../views/members/MembersView.vue';
import MemberView from '../views/members/MemberView.vue';

import TeamsView from '../views/teams/TeamsView.vue';
import TeamView from '../views/teams/TeamView.vue';

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
    // MEMBERS
    {
      path: '/members',
      name: 'members',
      component: MembersView
    },
    {
      path: '/members/:id',
      name: 'member',
      component: MemberView
    },
    // TEAMS
    {
      path: '/teams',
      name: 'teams',
      component: TeamsView
    },
    {
      path: '/teams/:id',
      name: 'team',
      component: TeamView
    }
  ]
});

router.beforeEach((to, from, next) => {
  setDocumentTitle(String(to.name));
  next();
});

export default router;
