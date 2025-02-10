<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import TaskList from '@/components/tasks/TaskList.vue';
import TeamCard from '@/components/teams/TeamCard.vue';
import { useTasksStore } from '@/stores/tasks';
import { useTeamsStore } from '@/stores/teams';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();
const params = router.currentRoute?.value.params;

const teamsStore = useTeamsStore();
const tasksStore = useTasksStore();

onMounted(async () => {
  if (typeof params.id === 'string') {
    try {
      // delete previous to avoid flickering
      teamsStore.resetTeam();
      await teamsStore.fetchTeam(params.id);
    } catch (error) {
      toast.error("Erreur lors du chargement de l'équipe");
    }
    try {
      await tasksStore.fetchTeamTasks(params.id);
    } catch (error) {
      /* toast.error('Erreur lors du chargement des tâches'); */
    }
  }
});
</script>

<template>
  <WrapperElement>
    <template v-if="teamsStore.team.name">
      <SectionElement :title="teamsStore.team.name">
        <template #content>
          <TeamCard :team="teamsStore.team" />
        </template>
      </SectionElement>
    </template>
    <SpinnerElement v-else />

    <SectionElement :title="'Tâches de l\'équipe'" class="mt-5">
        <template #content>
          <TaskList :tasks="tasksStore.tasks" v-if="tasksStore.tasks.length" />
          <p v-else>Aucune tâche n'a été trouvée pour cette équipe</p>
        </template>
        <template #actions>
          <!-- <TaskAddButton /> -->
        </template>
    </SectionElement>
  </WrapperElement>
</template>
