<script setup lang="ts">
import LogoImage from '@/components/images/LogoImage.vue';
import { useAuthStore } from '@/stores/auth';
import { getAppName, toggleAppSidebarWithTransition } from '@/utils/app';
import { Bars3BottomLeftIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
import { BellIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ButtonElement from './elements/ButtonElement.vue';
import IconElement from './elements/IconElement.vue';
import InputElement from './elements/InputElement.vue';
import WrapperElement from './elements/WrapperElement.vue';
import { useNotificationStore } from '@/stores/notifications';
import { ref } from 'vue';

const useAuth = useAuthStore();
const router = useRouter();
const notifStore = useNotificationStore();
const showNotifications = ref(false);

let user: any = null;
if (useAuth.user) {
  user = useAuth.user;
}

function logout() {
  useAuth.logout();
  router.push({ name: 'home' }).then(() => {
    toast.success('Vous êtes déconnecté avec succès');
  });
}
</script>

<template>
  <header
    id="topbar"
    class="fixed top-0 left-0 right-0 h-16 z-[100] bg-white dark:bg-black-lightend shadow dark:shadow-[0_0_10px_#000000]"
  >
    <WrapperElement>
      <nav class="flex justify-between items-center">
        <div class="flex items-center gap-2 sm:gap-0">
          <div class="flex items-center w-auto sm:w-60">
            <RouterLink :to="{ name: 'home' }" class="flex items-center gap-1">
              <LogoImage />
              <span class="text-2xl font-semibold hidden sm:block">{{
                getAppName().toString()
              }}</span>
            </RouterLink>
          </div>
          <div class="flex items-center gap-5">
            <div class="flex items-center">
              <IconElement @click="toggleAppSidebarWithTransition">
                <Bars3BottomLeftIcon class="w-6 h-6" />
              </IconElement>
            </div>
            <div class="relative hidden md:flex items-center">
              <InputElement type="search" id="topbar-search" name="q" placeholder="Rechercher..." />
              <div class="flex absolute inset-y-0 right-2 items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon class="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 sm:gap-1">
          <div class="flex md:hidden items-center">
            <IconElement>
              <MagnifyingGlassIcon class="w-6 h-6" />
            </IconElement>
          </div>
          <div class="hidden xxxs:flex items-center gap-3 sm:gap-2">
            <template v-if="useAuth.user && user.id">
              <IconElement class="relative" @click="showNotifications = !showNotifications">
                <BellIcon class="w-6 h-6" />
                <span
                  v-if="notifStore.count > 0"
                  class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-semibold flex items-center justify-center rounded-full"
                >
                  {{ notifStore.count }}
                </span>

                <div
                  v-if="showNotifications"
                  class="absolute right-0 mt-2 w-80 bg-white dark:bg-black-lightend rounded-xl shadow-lg p-3 z-50"
                >
                  <h3 class="text-md font-semibold mb-2">Notifications</h3>
                  <div
                    v-if="notifStore.latest.length > 0"
                    class="flex flex-col gap-2 max-h-80 overflow-y-auto"
                  >
                    <div
                      v-for="(notif) in notifStore.latest"
                      :key="notif.id"
                      class="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-black-dark cursor-pointer"
                    >
                      <div class="font-semibold">{{ notif.title }}</div>
                      <div class="text-xs text-gray-500 truncate">{{ notif.description }}</div>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-400 text-center p-4">
                    Pas de nouvelles notifications
                  </div>
                </div>
              </IconElement>

              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold">{{ user.email }}</span>
                <ButtonElement @click="logout" title="Déconnexion">Déconnexion</ButtonElement>
              </div>
            </template>
            <template v-else>
              <div class="hidden xxs:flex items-center">
                <RouterLink to="/login">
                  <ButtonElement title="Connexion">Connexion</ButtonElement>
                </RouterLink>
              </div>
              <div class="flex items-center">
                <RouterLink to="/register">
                  <ButtonElement title="Inscription" primary>Inscription</ButtonElement>
                </RouterLink>
              </div>
            </template>
          </div>
        </div>
      </nav>
    </WrapperElement>
  </header>
</template>
