<script setup lang="ts">
import InputElement from '@/components/elements/InputElement.vue';
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import { useSignalementsStore } from '@/stores/signalements';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ButtonElement from '../elements/ButtonElement.vue';

const router = useRouter();
const params = router.currentRoute?.value.params;

import type { Signalement } from '@/types/Signalement';

const props = defineProps({
  signalement: {
    type: Object as () => Signalement,
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

const signalementRef = ref<Signalement>({
  description: '',
  catId: 0,
  priorityLevel: 0,
  longitude: 0,
  latitude: 0
});

if (props.signalement) {
  signalementRef.value = props.signalement;
}

const $emit = defineEmits(['close']);

const signalementsStore = useSignalementsStore();

const handleSubmit = async () => {
  // Check if all fields are filled
  if (!signalementRef.value.description) {
    toast.error('Veuillez remplir tous les champs');
    return;
  }

  try {
    // Update or create
    if (props.edit && signalementRef.value.id) {
      await signalementsStore.updateSignalement(signalementRef.value);
    } else {
      await signalementsStore.createSignalement(signalementRef.value);
    }
    // Display success message
    toast.success(props.edit ? 'signalement modifié avec succès' : 'signalement ajouté avec succès');

    // close modal if we are in one
    $emit('close');

    // Refresh list & redirect
    await signalementsStore.fetchSignalements();
    router.push({ name: 'signalements' });
  } catch (error) {
    // Display error message
    toast.error(
      props.edit
        ? 'Une erreur est survenue lors de la modification de signalement'
        : "Une erreur est survenue lors de l'ajout de signalement"
    );
  }
};
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <InputgroupElement>
      <template #label>
        <LabelElement>Description</LabelElement>
      </template>
      <template #input>
        <InputElement v-model="signalementRef.description" :id="'description'" />
      </template>
    </InputgroupElement>
    <footer class="flex justify-end gap-2">
      <ButtonElement @click="$emit('close')">Annuler</ButtonElement>
      <ButtonElement primary type="submit">{{ okText }}</ButtonElement>
    </footer>
  </form>
</template>
