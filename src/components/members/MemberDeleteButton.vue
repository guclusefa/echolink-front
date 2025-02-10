<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import router from '@/router';
import { useMembersStore } from '@/stores/members';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

import type { Member } from '@/types/member';

const props = defineProps({
  member: {
    type: Object as () => Member,
    required: true
  }
});

const showModal = ref(false);

function toggleModal() {
  showModal.value = !showModal.value;
}

const membersStore = useMembersStore();

const deleteMember = async () => {
  // Check if has an id
  if (!props.member._id) return;

  try {
    // Delete member from the store
    await membersStore.deleteMember(props.member._id);

    // Display success message
    toast.success('Le membre a été supprimé avec succès');

    // Refresh list & redirect
    await membersStore.fetchMembers();
    router.push({ name: 'members' });
  } catch (error) {
    toast.error('Une erreur est survenue lors de la suppression du membre');
  }
}
</script>

<template>
  <ButtonElement danger @click="toggleModal">Supprimer</ButtonElement>
  <ModalElement
    v-if="showModal"
    @close="toggleModal"
    :title="'Suppression du membre ' + props.member.firstName + ' ' + props.member.lastName + ''"
  >
    <div>
      <p>
        Êtes-vous sûr de vouloir supprimer le membre <b>{{ member.firstName }} {{ member.lastName }}</b> ?
      </p>
      <footer class="flex justify-end gap-2">
        <ButtonElement @click="toggleModal">Annuler</ButtonElement>
        <ButtonElement danger type="submit" @click="deleteMember">Supprimer</ButtonElement>
      </footer>
    </div>
  </ModalElement>
</template>
