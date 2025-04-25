<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import SignalementAddButton from '@/components/signalements/SignalementAddButton.vue';
import SignalementList from '@/components/signalements/SignalementList.vue';
import { useAuthStore } from '@/stores/auth';
import { useSignalementsStore } from '@/stores/signalements';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const loading = ref(false);
const signalementsStore = useSignalementsStore();
const route = useRoute();
const useAuth = useAuthStore();
let user: any = null;
const locationAddress = ref('Localisation inconnue');

if (useAuth.user) {
  user = useAuth.user;
}

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          locationAddress.value = data.display_name || 'Localisation inconnue';
        } catch (error) {
          toast.error('Erreur lors de la récupération de la localisation.');
        }
      },
      () => {
        toast.error('Accès à la localisation refusé.');
      }
    );
  } else {
    toast.error("La géolocalisation n'est pas supportée par votre navigateur");
  }
};

onMounted(async () => {
  getLocation();
  loading.value = true;
  await signalementsStore.fetchSignalements();
  loading.value = false;
});

const reloadSignalements = async () => {
  loading.value = true;
  await signalementsStore.fetchSignalements();
  loading.value = false;
};

onMounted(() => {
  reloadSignalements();
});

watch(
  () => route.fullPath,
  async () => {
    loading.value = true;
    await signalementsStore.fetchSignalements();
    loading.value = false;
  }
);
</script>

<template>
  <WrapperElement>
    <div class="text-gray-600 text-sm mb-4">
      Votre localisation approximative : {{ locationAddress }}
    </div>
    <div class="text-gray-600 text-sm mb-4">
      Les signalements sont triés en fontction des plus proches de votre localisation.
    </div>
    <SectionElement title="Signalements">
      <template #actions v-if="useAuth.user && user.id">
        <SignalementAddButton />
      </template>
      <template #content>
        <SpinnerElement large v-if="loading" />
        <SignalementList :signalements="signalementsStore.signalements" v-else />
      </template>
    </SectionElement>
  </WrapperElement>
</template>
