<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import router from '@/router';
import { useTeamsStore } from '@/stores/teams';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

import type { Team } from '@/types/team';

const props = defineProps({
  team: {
    type: Object as () => Team,
    required: true
  }
});

const showModal = ref(false);

function toggleModal() {
  showModal.value = !showModal.value;
}

const teamsStore = useTeamsStore();

const deleteTeam = async () => {
  // Check if has an id
  if (!props.team._id) return;

  try {
    // Delete team from the store
    await teamsStore.deleteTeam(props.team._id);

    // Display success message
    toast.success('Léquipe a été supprimé avec succès');

    // Refresh list & redirect
    await teamsStore.fetchTeams();
    router.push({ name: 'teams' });
  } catch (error) {
    toast.error('Une erreur est survenue lors de la suppression de léquipe');
  }
};
</script>

<template>
  <ButtonElement danger @click="toggleModal">Supprimer</ButtonElement>
  <ModalElement
    v-if="showModal"
    @close="toggleModal"
    :title="'Suppression de léquipe ' + props.team.name"
  >
    <div>
      <p>
        Êtes-vous sûr de vouloir supprimer léquipe <b>{{ team.name }}</b> ?
      </p>
      <footer class="flex justify-end gap-2">
        <ButtonElement @click="toggleModal">Annuler</ButtonElement>
        <ButtonElement danger type="submit" @click="deleteTeam">Supprimer</ButtonElement>
      </footer>
    </div>
  </ModalElement>
</template>
