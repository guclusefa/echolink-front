<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import { ref } from 'vue';
import TaskForm from './TaskForm.vue';

import type { Task } from '@/types/Task';

const showModal = ref(false);

const props = defineProps({
  task: {
    type: Object as () => Task,
    required: true
  }
});

function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <ButtonElement secondary @click="toggleModal">Modifier</ButtonElement>
  <ModalElement v-if="showModal" @close="toggleModal" :title="'Modification de la tâche ' + props.task.name + ''">
    <TaskForm @close="toggleModal" :task="props.task" :okText="'Modifier'" edit />
  </ModalElement>
</template>
