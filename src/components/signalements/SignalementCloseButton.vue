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
  // Check if has an id
  if (!props.signalement.id) return;

  try {
    // Delete signalement from the store
    await signalementsStore.deleteSignalement(props.signalement.id);

    // Display success message
    toast.success('signalement a été fermé avec succès');

    // Refresh list & redirect
    await signalementsStore.fetchSignalements();
    router.push({ name: 'signalements' });
  } catch (error) {
    toast.error('Une erreur est survenue lors de la fermeture de signalement');
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
        Êtes-vous sûr de vouloir fermer signalement <b>{{ signalement.description }}</b> ?
      </p>
      <footer class="flex justify-end gap-2">
        <ButtonElement @click="toggleModal">Annuler</ButtonElement>
        <ButtonElement danger type="submit" @click="deleteSignalement">Fermer</ButtonElement>
      </footer>
    </div>
  </ModalElement>
</template>
