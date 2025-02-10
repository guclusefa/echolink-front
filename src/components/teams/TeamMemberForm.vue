<script setup lang="ts">
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import { useTeamsStore } from '@/stores/teams';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ButtonElement from '../elements/ButtonElement.vue';

const router = useRouter();
const params = router.currentRoute?.value.params;

import { useMembersStore } from '@/stores/members';
import type { Team } from '@/types/team';
import { onMounted } from 'vue';
import SelectElement from '../elements/SelectElement.vue';

const props = defineProps({
  team: {
    type: Object as () => Team,
    required: true
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

const teamMemberRef = ref<any>({
  member: ''
});

if (props.team) {
  teamMemberRef.value = props.team;
}

const $emit = defineEmits(['close']);

const teamsStore = useTeamsStore();
const membersStore = useMembersStore();

const handleSubmit = async () => {
  if (props.team._id === undefined) {
    return;
  }
  // Check if all fields are filled
  if (!teamMemberRef.value.member) {
    toast.error('Veuillez remplir tous les champs');
    return;
  }

  try {
    await teamsStore.addMemberToTeam(props.team._id, teamMemberRef.value.member);
    toast.success('Membre ajouté avec succès');
        // close modal if we are in one
        $emit('close');

        window.location.reload();
  } catch (error) {
    toast.error("Une erreur est survenue lors de l'ajout du membre");
  }
};

let membersOptions = ref<{ value: string; label: string }[]>([]);
onMounted(async () => {
  membersOptions.value = membersStore.members.map((member) => ({
    value: member._id,
    label: member.firstName + ' ' + member.lastName
  }));
});
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <InputgroupElement class="mb-20">
      <template #label>
        <LabelElement>Membre</LabelElement>
      </template>
      <template #input>
        <SelectElement v-model="teamMemberRef.member" :options="membersOptions" />
      </template>
    </InputgroupElement>
    <footer class="flex justify-end gap-2 mt-20">
      <ButtonElement @click="$emit('close')">Annuler</ButtonElement>
      <ButtonElement primary type="submit">{{ okText }}</ButtonElement>
    </footer>
  </form>
</template>
