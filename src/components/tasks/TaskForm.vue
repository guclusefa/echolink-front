<script setup lang="ts">
import InputElement from '@/components/elements/InputElement.vue';
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import { useTasksStore } from '@/stores/tasks';
import { formatDate } from '@/utils/date';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ButtonElement from '../elements/ButtonElement.vue';
import SelectElement from '../elements/SelectElement.vue';

const router = useRouter();
const params = router.currentRoute?.value.params;

import type { Task } from '@/types/task';

const props = defineProps({
  task: {
    type: Object as () => Task,
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

const taskRef = ref<Task>({
  name: '',
  description: '',
  priority: 0,
  startDate: '',
  endDate: '',
  status: '',
  duration: 1
});

if (props.task) {
  taskRef.value = props.task;
  taskRef.value.startDate = formatDate(taskRef.value.startDate);
  taskRef.value.endDate = formatDate(taskRef.value.endDate);
}

const $emit = defineEmits(['close']);

const tasksStore = useTasksStore();

const handleSubmit = async () => {
  // Check if all fields are filled
  if (
    !taskRef.value.name ||
    !taskRef.value.description ||
    !taskRef.value.priority ||
    !taskRef.value.startDate ||
    !taskRef.value.endDate ||
    !taskRef.value.status ||
    !taskRef.value.duration
  ) {
    toast.error('Veuillez remplir tous les champs');
    return;
  }

  try {
    // Update or create
    if (props.edit && taskRef.value._id) {
      await tasksStore.updateTask(taskRef.value);
    } else {
      await tasksStore.createTask(taskRef.value);
    }
    // Display success message
    toast.success(props.edit ? 'Tâche modifiée avec succès' : 'Tâche ajoutée avec succès');

    // close modal if we are in one
    $emit('close');

    // Refresh list & redirect
    if (params.id && typeof params.id === 'string') {
      // on create only
      if (!props.edit && tasksStore.createdTask) {
        await tasksStore.assignTaskToWorker(params.id, tasksStore.createdTask._id);
      }
      await tasksStore.fetchWorkerTasks(params.id);
      window.location.reload();
    } else {
      await tasksStore.fetchTasks();
    }
    /*     router.push({ name: 'tasks' }); */
  } catch (error) {
    // Display error message
    toast.error(
      props.edit
        ? 'Une erreur est survenue lors de la modification de la tâche'
        : "Une erreur est survenue lors de l'ajout de la tâche"
    );
  }
};

// ???
const priorityOptions: SelectOption[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' }
];

const statusOptions: SelectOption[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Done', label: 'Terminée' },
  { value: 'In progress', label: 'En cours' },
  { value: 'To do', label: 'A faire' },
  { value: 'Pending', label: 'En attente' }
];
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <InputgroupElement>
      <template #label>
        <LabelElement>Nom</LabelElement>
      </template>
      <template #input>
        <InputElement v-model="taskRef.name" :id="'name'" />
      </template>
    </InputgroupElement>
    <InputgroupElement>
      <template #label>
        <LabelElement>Description</LabelElement>
      </template>
      <template #input>
        <InputElement v-model="taskRef.description" :id="'description'" />
      </template>
    </InputgroupElement>
    <InputgroupElement>
      <template #label>
        <LabelElement>Priorité</LabelElement>
      </template>
      <template #input>
        <SelectElement v-model="taskRef.priority" :options="priorityOptions" :id="'priority'" />
      </template>
    </InputgroupElement>
    <InputgroupElement>
      <template #label>
        <LabelElement>Date de début</LabelElement>
      </template>
      <template #input>
        <InputElement v-model="taskRef.startDate" :id="'startDate'" type="date" />
      </template>
    </InputgroupElement>
    <InputgroupElement>
      <template #label>
        <LabelElement>Date de fin</LabelElement>
      </template>
      <template #input>
        <InputElement v-model="taskRef.endDate" :id="'endDate'" type="date" />
      </template>
    </InputgroupElement>
    <InputgroupElement>
      <template #label>
        <LabelElement>Status</LabelElement>
      </template>
      <template #input>
        <SelectElement v-model="taskRef.status" :options="statusOptions" :id="'status'" />
      </template>
    </InputgroupElement>
    <footer class="flex justify-end gap-2">
      <ButtonElement @click="$emit('close')">Annuler</ButtonElement>
      <ButtonElement primary type="submit">{{ okText }}</ButtonElement>
    </footer>
  </form>
</template>
