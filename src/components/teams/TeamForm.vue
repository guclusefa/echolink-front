<script setup lang="ts">
import InputElement from '@/components/elements/InputElement.vue';
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import { useTeamsStore } from '@/stores/teams';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ButtonElement from '../elements/ButtonElement.vue';

const router = useRouter();
const params = router.currentRoute?.value.params;

import type { Team } from '@/types/team';

const props = defineProps({
  team: {
    type: Object as () => Team,
    required: false
  },
  okText: {
    type: String,
    default: 'Valider'
  },
  edit: {
    type: Boolean,
    default: false
  }
});

const teamRef = ref<Team>({
  name: ''
});

if (props.team) {
  teamRef.value = props.team;
}

const $emit = defineEmits(['close']);

const teamsStore = useTeamsStore();

const handleSubmit = async () => {
  // Check if all fields are filled
  if (!teamRef.value.name) {
    toast.error('Veuillez remplir tous les champs');
    return;
  }

  try {
    // Update or create
    if (props.edit && teamRef.value._id) {
      await teamsStore.updateTeam(teamRef.value);
    } else {
      await teamsStore.createTeam(teamRef.value);
    }
    // Display success message
    toast.success(props.edit ? 'Équipe modifiée avec succès' : 'Équipe ajoutée avec succès');

    // close modal if we are in one
    $emit('close');

    // Refresh list & redirect
    await teamsStore.fetchTeams();
    router.push({ name: 'teams' });
  } catch (error) {
    // Display error message
    toast.error(
      props.edit
        ? 'Une erreur est survenue lors de la modification de léquipe'
        : "Une erreur est survenue lors de l'ajout de léquipe"
    );
  }
};
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <InputgroupElement>
      <template #label>
        <LabelElement>Nom</LabelElement>
      </template>
      <template #input>
        <InputElement v-model="teamRef.name" :id="'name'" />
      </template>
    </InputgroupElement>
    <footer class="flex justify-end gap-2">
      <ButtonElement @click="$emit('close')">Annuler</ButtonElement>
      <ButtonElement primary type="submit">{{ okText }}</ButtonElement>
    </footer>
  </form>
</template>
