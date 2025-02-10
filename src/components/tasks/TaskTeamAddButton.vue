<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import { ref } from 'vue';
import TaskForm from './TaskForm.vue';
const showModal = ref(false);
function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <ButtonElement primary @click="toggleModal">Ajouter une tâche</ButtonElement>
  <ModalElement v-if="showModal" title="Ajouter une tâche" @close="toggleModal">
    <TaskForm @close="toggleModal" :okText="'Ajouter'" />
  </ModalElement>
</template>
