<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import { ref } from 'vue';
import TeamForm from './TeamForm.vue';
const showModal = ref(false);
function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <ButtonElement primary @click="toggleModal">Ajouter une équipe</ButtonElement>
  <ModalElement v-if="showModal" title="Ajouter une équipe" @close="toggleModal">
    <TeamForm @close="toggleModal" :okText="'Ajouter'" />
  </ModalElement>
</template>
