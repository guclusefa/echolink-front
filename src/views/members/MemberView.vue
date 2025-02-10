<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MemberCard from '@/components/members/MemberCard.vue';
import TaskAddButton from '@/components/tasks/TaskAddButton.vue';
import TaskList from '@/components/tasks/TaskList.vue';
import { useJobsStore } from '@/stores/jobs';
import { useMembersStore } from '@/stores/members';
import { useTasksStore } from '@/stores/tasks';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();
const params = router.currentRoute?.value.params;

const membersStore = useMembersStore();
const jobsStore = useJobsStore();
const tasksStore = useTasksStore();

onMounted(async () => {
  if (typeof params.id === 'string') {
    try {
      // delete previous to avoid flickering
      membersStore.resetMember();
      await membersStore.fetchMember(params.id);
    } catch (error) {
      toast.error('Erreur lors du chargement du membre');
    }

    if (!jobsStore.jobs.length) {
      try {
        await jobsStore.fetchJobs();
      } catch (error) {
        toast.error('Erreur lors du chargement des jobs');
      }
    }

    try {
      await tasksStore.fetchWorkerTasks(params.id);
    } catch (error) {
      console.error(error);
    }
  }
});
</script>

<template>
  <WrapperElement>
    <template v-if="membersStore.member.firstName">
      <SectionElement :title="membersStore.member.firstName + ' ' + membersStore.member.lastName">
        <template #content>
          <MemberCard :member="membersStore.member" />
        </template>
      </SectionElement>

      <SectionElement :title="'Tâches de ' + membersStore.member.firstName" class="mt-5">
        <template #content>
          <TaskList :tasks="tasksStore.tasks" v-if="tasksStore.tasks.length" />
          <p v-else>Aucune tâche n'a été trouvée pour ce membre.</p>
        </template>
        <template #actions>
          <TaskAddButton />
        </template>
      </SectionElement>
    </template>
    <SpinnerElement v-else />
  </WrapperElement>
</template>
