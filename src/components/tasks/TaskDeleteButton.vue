<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import { useTasksStore } from '@/stores/tasks';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();
const params = router.currentRoute?.value.params;

import type { Task } from '@/types/task';

const props = defineProps({
  task: {
    type: Object as () => Task,
    required: true
  }
});

const showModal = ref(false);

function toggleModal() {
  showModal.value = !showModal.value;
}

const tasksStore = useTasksStore();

const deleteTask = async () => {
  // Check if has an id
  if (!props.task._id) return;

  try {
    // Delete task from the store
    await tasksStore.deleteTask(props.task._id);

    // Display success message
    toast.success('La tâche a été supprimé avec succès');

    // Refresh list & redirect
    if (typeof params.id === 'string') {
      await tasksStore.fetchWorkerTasks(params.id);
      window.location.reload();
    }
  } catch (error) {
    toast.error('Une erreur est survenue lors de la suppression de la tâche');
  }
}
</script>

<template>
  <ButtonElement danger @click="toggleModal">Supprimer</ButtonElement>
  <ModalElement
    v-if="showModal"
    @close="toggleModal"
    :title="'Suppression de la tâche ' + task.name"
  >
    <div>
      <p>
        Êtes-vous sûr de vouloir supprimer la tâche <strong>{{ task.name }}</strong> ?
      </p>
      <footer class="flex justify-end gap-2">
        <ButtonElement @click="toggleModal">Annuler</ButtonElement>
        <ButtonElement danger type="submit" @click="deleteTask">Supprimer</ButtonElement>
      </footer>
    </div>
  </ModalElement>
</template>
