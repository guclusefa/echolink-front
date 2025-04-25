<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { io } from 'socket.io-client';

import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import AppSidebar from './components/AppSidebar.vue';

import { useAuthStore } from './stores/auth';
import { useCategoriesStore } from './stores/categories';;

const authStore = useAuthStore();
const categoriesStore = useCategoriesStore();
const router = useRouter();

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  auth: {
    token: localStorage.getItem('token')
  },
  transports: ['websocket'],
  withCredentials: true
});

onMounted(async () => {
  if (authStore.token) {
    try {
      await authStore.getUser();
    } catch (error) {
      authStore.logout();
      router.push({ name: 'login' }).then(() => {
        window.location.reload();
        toast.error('Vous devez vous connecter pour accéder à cette page');
      });
    }
  }

  if (!categoriesStore.categories.length) {
    try {
      await categoriesStore.fetchCategories();
    } catch (error) {
      toast.error('Erreur lors du chargement des catégories');
    }
  }
});

onUnmounted(() => {
  socket.off('newSignalement');
});
</script>

<template>
  <AppHeader />
  <AppSidebar />
  <div id="container" class="h-full overflow-x-hidden z-50 flex flex-col mt-16 xl:ml-64">
    <main id="main" class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
