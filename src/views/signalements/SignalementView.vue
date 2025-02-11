<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import SignalementCard from '@/components/signalements/SignalementCard.vue';
import { useSignalementsStore } from '@/stores/signalements';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();
const params = router.currentRoute?.value.params;

const signalementsStore = useSignalementsStore();

onMounted(async () => {
  if (typeof params.id === 'string') {
    try {
      // delete previous to avoid flickering
      signalementsStore.resetSignalement();
      await signalementsStore.fetchSignalement(params.id);
    } catch (error) {
      toast.error("Erreur lors du chargement du signalement.");
    }
  }
});
</script>

<template>
  <WrapperElement>
    <template v-if="signalementsStore.signalement.description">
      <SectionElement :title="signalementsStore.signalement.description">
        <template #content>
          <SignalementCard :signalement="signalementsStore.signalement" />
        </template>
      </SectionElement>
    </template>
    <SpinnerElement v-else />
  </WrapperElement>
</template>
