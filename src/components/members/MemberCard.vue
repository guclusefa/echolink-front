<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useJobsStore } from '@/stores/jobs';
import { useMembersStore } from '@/stores/members';
import MembreDeleteButton from './MemberDeleteButton.vue';
import MembreEditButton from './MemberEditButton.vue';

import { useTeamsStore } from '@/stores/teams';
import type { Member } from '@/types/member';
import type { Team } from '@/types/team';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  member: {
    type: Object as () => Member,
    required: true
  }
});

const jobsStore = useJobsStore();
const teamsStore = useTeamsStore();
const membersStore = useMembersStore();
const authStore = useAuthStore();

// from jobsStore.jobs, get the job where the id is the same as the member.jobId
let job = jobsStore.jobs.find((job) => job._id === String(props.member.job));

let user: any = null;
let isMyself = false;
if (authStore.user) {
  user = authStore.user;
  isMyself = user?._id === props.member._id;
}

// watvhch for  changes in the member object
watch(
  () => props.member,
  (newMember) => {
    job = jobsStore.jobs.find((job) => job._id === String(newMember.job));
  }
);

let teams = ref<Team[]>([]);

onMounted(async () => {
  if (props.member._id) {
    try {
      teams.value = await membersStore.getMembersTeams(props.member._id);
    } catch (error) {
      console.error(error);
    }
  }
});
</script>

<template>
  <article
    class="p-4 bg-white rounded-lg shadow-xl flex flex-col gap-4 h-full dark:bg-black-lighter"
  >
    <RouterLink :to="{ name: 'member', params: { id: props.member._id } }">
      <header class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          {{ props.member.firstName }} {{ props.member.lastName }}
        </h3>
      </header>
      <div class="flex flex-col gap-2 flex-grow">
        <p class="text-sm text-gray">{{ props.member.email }}</p>
        <p class="text-sm text-gray" v-if="job">Poste: {{ job.name }}</p>
        <p class="text-sm text-gray" v-if="teams.length">Membre de {{ teams.length }} équipes</p>
        <ul class="flex flex-col gap-2 list-disc pl-4" v-if="teams.length">
          <li v-for="team in teams" :key="team._id">
            <RouterLink :to="{ name: 'team', params: { id: team._id } }" class="underline p-2 rounded-lg">
              {{ team.name }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </RouterLink>
    <footer class="flex items-center gap-2" v-if="isMyself">
      <MembreEditButton :member="props.member" />
      <MembreDeleteButton :member="props.member" />
    </footer>
  </article>
</template>
