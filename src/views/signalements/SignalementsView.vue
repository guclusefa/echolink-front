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

const loading = ref(false);

const signalementsStore = useSignalementsStore();

const useAuth = useAuthStore();
let user: any = null;
if (useAuth.user) {
  user = useAuth.user;
}


onMounted(async () => {
  if (!signalementsStore.signalements.length) {
    try {
      loading.value = true;
      await signalementsStore.fetchSignalements();
    } catch (error) {
      toast.error('Erreur lors du chargement des signalements.');
    } finally {
      loading.value = false;
    }
  }
});
</script>

<template>
  <WrapperElement>
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
