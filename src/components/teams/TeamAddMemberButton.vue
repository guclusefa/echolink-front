<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import type { Team } from '@/types/team';
import { ref } from 'vue';
import TeamMemberForm from './TeamMemberForm.vue';
const showModal = ref(false);
function toggleModal() {
  showModal.value = !showModal.value;
}

const props = defineProps({
  team: {
    type: Object as () => Team,
    required: true
  }
});
</script>

<template>
  <ButtonElement warning @click="toggleModal">Ajouter membre</ButtonElement>
  <ModalElement v-if="showModal" :title="'Ajouter un membre à l\'équipe' + props.team.name" @close="toggleModal">
    <TeamMemberForm @close="toggleModal" :okText="'Ajouter'" :team="props.team" />
  </ModalElement>
</template>
