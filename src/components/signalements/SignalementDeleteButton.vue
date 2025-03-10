<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import router from '@/router';
import { useSignalementsStore } from '@/stores/signalements';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

import type { Signalement } from '@/types/Signalement';

const props = defineProps({
  signalement: {
    type: Object as () => Signalement,
    required: true
  }
});

const showModal = ref(false);

function toggleModal() {
  showModal.value = !showModal.value;
}

const signalementsStore = useSignalementsStore();

const deleteSignalement = async () => {
  if (!props.signalement.id) return;

  try {
    await signalementsStore.deleteSignalement(props.signalement.id);

    toast.success('signalement a été supprimé avec succès');

    await signalementsStore.fetchSignalements();
    router.push({ name: 'signalements' });
  } catch (error) {
    toast.error('Une erreur est survenue lors de la suppression de signalement');
  }
};
</script>

<template>
  <ButtonElement danger @click="toggleModal">Supprimer</ButtonElement>
  <ModalElement
    v-if="showModal"
    @close="toggleModal"
    :title="'Suppression de signalement ' + props.signalement.description"
  >
    <div>
      <p>
        Êtes-vous sûr de vouloir supprimer signalement <b>{{ signalement.description }}</b> ?
      </p>
      <footer class="flex justify-end gap-2">
        <ButtonElement @click="toggleModal">Annuler</ButtonElement>
        <ButtonElement danger type="submit" @click="deleteSignalement">Supprimer</ButtonElement>
      </footer>
    </div>
  </ModalElement>
</template>
