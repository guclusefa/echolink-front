<script setup lang="ts">
import SignalementDeleteButton from './SignalementDeleteButton.vue';
import SignalementEditButton from './SignalementEditButton.vue';

import { useSignalementsStore } from '@/stores/signalements';
import type { Signalement } from '@/types/Signalement';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

const signalementsStore = useSignalementsStore();

const props = defineProps({
  signalement: {
    type: Object as () => Signalement,
    required: true
  }
});

let signalementId = props.signalement.id;
if (!signalementId) {
  throw new Error('Signalement ID is required');
}
</script>

<template>
  <article
    class="p-4 bg-white rounded-lg shadow-xl flex flex-col gap-4 h-full dark:bg-black-lighter"
    v-if="props.signalement.id"
  >
    <RouterLink :to="{ name: 'signalement', params: { id: props.signalement.id } }">
      <header class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">{{ props.signalement.description }}</h3>
      </header>
    </RouterLink>
    <footer class="flex items-center gap-2">
      <SignalementEditButton :signalement="props.signalement" />
    </footer>
    <footer class="flex items-center gap-2">
      <SignalementDeleteButton :signalement="props.signalement" />
    </footer>
  </article>
</template>
