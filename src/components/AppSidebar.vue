<script setup lang="ts">
import {
isAppSidebarToggled,
toggleAppSidebar,
toggleAppSidebarWithTransition,
toggleAppSidebarWithTransitionOnMobile
} from '@/utils/app';
import { HomeIcon, UserGroupIcon, UsersIcon } from '@heroicons/vue/24/outline';
import { HomeIcon as HomeIconSolid, UserGroupIcon as UserGroupIconSolid, UsersIcon as UsersIconSolid } from '@heroicons/vue/24/solid';
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import WrapperElement from './elements/WrapperElement.vue';
import LocaleChooser from './fragments/LocaleChooser.vue';
import ThemeSwitcher from './fragments/ThemeSwitcher.vue';

function watchEscapeKey() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isAppSidebarToggled() && window.innerWidth < 1280) {
      toggleAppSidebarWithTransition();
    }
  });
}

onMounted(() => {
  if (window.innerWidth < 1280 || !isAppSidebarToggled()) {
    toggleAppSidebar();
  }
  watchEscapeKey();
});

const navLinks = [
  {
    name: 'home',
    label: 'Accueil',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
    needsAuth: false
  },
  {
    name: 'members',
    label: 'Membres',
    icon: UsersIcon,
    iconSolid: UsersIconSolid,
    needsAuth: true
  },
  {
    name: 'teams',
    label: 'Équipes',
    icon: UserGroupIcon,
    iconSolid: UserGroupIconSolid,
    needsAuth: true
  }
];

const useAuth = useAuthStore();

let user: any = null;
if (useAuth.user) {
  user = useAuth.user;
}
</script>

<template>
  <aside
    id="sidebar"
    class="fixed top-16 left-0 bottom-0 w-64 !max-w-[100%] z-[99] bg-white dark:bg-black-lightend shadow dark:shadow-[0_0_10px_#000000]"
  >
    <WrapperElement class="h-full overflow-x-hidden overflow-y-auto">
      <nav class="h-full flex flex-col justify-between gap-5">
        <ul class="flex flex-col gap-2">
          <li v-for="link in navLinks" :key="link.name">
            <RouterLink
              v-if="(link.needsAuth && useAuth.user && user.id) || !link.needsAuth"
              :to="{ name: link.name }"
              class="flex items-center gap-2 p-2 rounded hover:bg-white-darker dark:hover:bg-black-lightest"
              active-class="bg-white-darkend dark:bg-black-lighter"
              @click="toggleAppSidebarWithTransitionOnMobile"
              v-slot="{ isActive }"
            >
              <component :is="isActive ? link.iconSolid : link.icon" class="w-5 h-5 text-secondary dark:text-primary" />
              <span>{{ link.label }}</span>
            </RouterLink>
          </li>
        </ul>
        <ul class="flex items-center justify-between gap-3">
          <div class="flex items-center">
            <li><ThemeSwitcher /></li>
          </div>
          <div class="flex items-center">
            <li><LocaleChooser /></li>
          </div>
        </ul>
      </nav>
    </WrapperElement>
  </aside>
  <Teleport to="body">
    <div class="sidebar-overlay" @click="toggleAppSidebarWithTransition" />
  </Teleport>
</template>

<style>
@media (max-width: 1280px) {
  .sidebar-toggled .sidebar-overlay {
    z-index: 98;
    display: block;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
  }
  .dark .sidebar-toggled .sidebar-overlay {
    background-color: rgba(251, 250, 253, 0.132);
  }
}
</style>
