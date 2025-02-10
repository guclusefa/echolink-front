<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import ModalElement from '@/components/elements/ModalElement.vue';
import { ref } from 'vue';
import MemberForm from './MemberForm.vue';

import type { Member } from '@/types/member';

const showModal = ref(false);

const props = defineProps({
  member: {
    type: Object as () => Member,
    required: true
  }
});

function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <ButtonElement secondary @click="toggleModal">Modifier</ButtonElement>
  <ModalElement v-if="showModal" @close="toggleModal" :title="'Modification du membre ' + props.member.firstName + ' ' + props.member.lastName + ''">
    <MemberForm @close="toggleModal" :member="props.member" :okText="'Modifier'" edit />
  </ModalElement>
</template>
