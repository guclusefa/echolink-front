<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import { ref } from 'vue';
import MemberForm from './MemberForm.vue';
const showModal = ref(false);
function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <ButtonElement primary @click="toggleModal">Ajouter un travailleur</ButtonElement>
  <ModalElement v-if="showModal" title="Ajouter un membre" @close="toggleModal">
    <MemberForm @close="toggleModal" :okText="'Ajouter'" />
  </ModalElement>
</template>
