<script setup lang="ts">
import { useMembersStore } from '@/stores/members';
import TeamDeleteButton from './TeamDeleteButton.vue';
import TeamEditButton from './TeamEditButton.vue';

import { useTeamsStore } from '@/stores/teams';
import type { Member } from '@/types/member';
import type { Team } from '@/types/team';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';
import TeamAddMemberButton from './TeamAddMemberButton.vue';

const membersStore = useMembersStore();
const teamsStore = useTeamsStore();

const props = defineProps({
  team: {
    type: Object as () => Team,
    required: true
  }
});

let teamId = props.team._id;
if (!teamId) {
  throw new Error('Team ID is required');
}

const members = ref<Member[]>([]);
onMounted(async () => {
  try {
    members.value = await teamsStore.getTeamsMembers(teamId);
  } catch (error) {
    console.error(error);
  }
});

const removeMemberFromTeam = async (teamId: string, memberId: string) => {
  try {
    await teamsStore.removeMemberFromTeam(teamId, memberId);
    toast.success('Membre supprimé de l\'équipe avec succès');
    members.value = members.value.filter((member) => member._id !== memberId);
  } catch (error) {
    toast.error('Erreur lors de la suppression du membre de l\'équipe');
  }
};
</script>

<template>
  <article
    class="p-4 bg-white rounded-lg shadow-xl flex flex-col gap-4 h-full dark:bg-black-lighter"
    v-if="props.team._id"
  >
    <RouterLink :to="{ name: 'team', params: { id: props.team._id } }">
      <header class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">{{ props.team.name }}</h3>
      </header>
    </RouterLink>
    <div class="flex flex-col gap-2 flex-grow">
      <p class="text-sm text-gray">{{ members.length }} membres</p>
      <ul class="flex flex-col gap-2 list-disc pl-4">
        <li v-for="member in members" :key="member._id">
          <RouterLink :to="{ name: 'member', params: { id: member._id } }" class="underline p-2 rounded-lg">
            {{ member.firstName }} {{ member.lastName }}
          </RouterLink>
          <span class="underline text-red-600 cursor-pointer" @click="removeMemberFromTeam(props.team._id, member._id)" v-if="member._id">
            Supprimer
          </span>
        </li>
      </ul>
    </div>
    <footer class="flex items-center gap-2">
      <TeamEditButton :team="props.team" />
      <TeamAddMemberButton :team="props.team" />
    </footer>
    <footer class="flex items-center gap-2">
      <TeamDeleteButton :team="props.team" />
    </footer>
  </article>
</template>
