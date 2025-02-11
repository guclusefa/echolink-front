<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import { ref } from 'vue';
import SignalementForm from './SignalementForm.vue';

import type { Signalement } from '@/types/Signalement';

const showModal = ref(false);

const props = defineProps({
  signalement: {
    type: Object as () => Signalement,
    required: true
  }
});

function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <ButtonElement secondary @click="toggleModal">Modifier</ButtonElement>
  <ModalElement v-if="showModal" @close="toggleModal" :title="'Modification de signalement ' + props.signalement.description + ''">
    <SignalementForm @close="toggleModal" :signalement="props.signalement" :okText="'Modifier'" edit />
  </ModalElement>
</template>
