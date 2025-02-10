<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import { ref } from 'vue';
import TeamForm from './TeamForm.vue';

import type { Team } from '@/types/Team';

const showModal = ref(false);

const props = defineProps({
  team: {
    type: Object as () => Team,
    required: true
  }
});

function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <ButtonElement secondary @click="toggleModal">Modifier</ButtonElement>
  <ModalElement v-if="showModal" @close="toggleModal" :title="'Modification de léquipe ' + props.team.name + ''">
    <TeamForm @close="toggleModal" :team="props.team" :okText="'Modifier'" edit />
  </ModalElement>
</template>
