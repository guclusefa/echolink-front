<script setup lang="ts">
import { formatDate, formatDateToFrench } from '@/utils/date';
import TaskDeleteButton from './TaskDeleteButton.vue';
import TaskEditButton from './TaskEditButton.vue';

import { useMembersStore } from '@/stores/members';
import type { Task } from '@/types/task';

const props = defineProps({
  task: {
    type: Object as () => Task,
    required: true
  }
});

const membersStore = useMembersStore();


let assignedTo = null;
if (props.task.assignedTo) {
  const assignedToMember = membersStore.members.find((member) => member._id === props.task.assignedTo[0]);
  if (assignedToMember)
  assignedTo = `${assignedToMember.firstName} ${assignedToMember.lastName}`;
}
</script>

<template>
  <article
    class="p-4 bg-white rounded-lg shadow-xl flex flex-col gap-4 h-full dark:bg-black-lighter"
  >
    <header class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">{{ props.task.name }}</h3>
      <span class="px-2 py-1 text-xs font-semibold text-white bg-orange-600 rounded-full">
        {{ props.task.status }}
      </span>
    </header>
    <div class="flex flex-col gap-2 flex-grow">
      <p class="text-sm text-gray">{{ props.task.description }}</p>
      <p class="text-sm text-gray">Priorité: {{ props.task.priority }}</p>
      <p class="text-sm text-gray">Début: {{ formatDateToFrench(formatDate(props.task.startDate)) }}</p>
      <p class="text-sm text-gray">Fin: {{ formatDateToFrench(formatDate(props.task.endDate)) }}</p>
      <p class="text-sm text-gray">Assigné à : {{ assignedTo }}</p>
    </div>
    <footer class="flex items-center gap-2">
      <TaskEditButton :task="props.task" />
      <TaskDeleteButton :task="props.task" />
    </footer>
  </article>
</template>
