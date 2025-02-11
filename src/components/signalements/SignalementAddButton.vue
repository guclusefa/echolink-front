<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import { ref } from 'vue';
import SignalementForm from './SignalementForm.vue';
const showModal = ref(false);
function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <ButtonElement primary @click="toggleModal">Ajouter un signalement</ButtonElement>
  <ModalElement v-if="showModal" title="Ajouter un signalement" @close="toggleModal">
    <SignalementForm @close="toggleModal" :okText="'Ajouter'" />
  </ModalElement>
</template>
