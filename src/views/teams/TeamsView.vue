<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import TeamAddButton from '@/components/teams/TeamAddButton.vue';
import TeamList from '@/components/teams/TeamList.vue';
import { useJobsStore } from '@/stores/jobs';
import { useTeamsStore } from '@/stores/teams';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

const loading = ref(false);

const teamsStore = useTeamsStore();
const jobsStore = useJobsStore();

onMounted(async () => {
  if (!teamsStore.teams.length) {
    try {
      loading.value = true;
      await teamsStore.fetchTeams();
    } catch (error) {
      toast.error('Erreur lors du chargement des équipes');
    } finally {
      loading.value = false;
    }
  }

  if (!jobsStore.jobs.length) {
    try {
      loading.value = true;
      await jobsStore.fetchJobs();
    } catch (error) {
      toast.error('Erreur lors du chargement des jobs');
    } finally {
      loading.value = false;
    }
  }
});
</script>

<template>
  <WrapperElement>
    <SectionElement title="Équipes">
      <template #actions>
        <TeamAddButton />
      </template>
      <template #content>
        <SpinnerElement large v-if="loading" />
        <TeamList :teams="teamsStore.teams" v-else />
      </template>
    </SectionElement>
  </WrapperElement>
</template>
