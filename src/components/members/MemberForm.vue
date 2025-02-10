<script setup lang="ts">
import InputElement from '@/components/elements/InputElement.vue';
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import router from '@/router';
import { useJobsStore } from '@/stores/jobs';
import { useMembersStore } from '@/stores/members';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';
import ButtonElement from '../elements/ButtonElement.vue';
import SelectElement from '../elements/SelectElement.vue';

import type { Member } from '@/types/member';

const props = defineProps({
  member: {
    type: Object as () => Member,
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

const memberRef = ref<Member>({
  firstName: '',
  lastName: '',
  job: 0
});

if (props.member) {
  memberRef.value = props.member;
}

const $emit = defineEmits(['close']);

const membersStore = useMembersStore();

const handleSubmit = async () => {
  // Check if all fields are filled
  if (!memberRef.value.firstName || !memberRef.value.lastName) {
    toast.error('Veuillez remplir tous les champs');
    return;
  }

  try {
    // Update or create
    if (props.edit && memberRef.value._id) {
      await membersStore.updateMember(memberRef.value);
    } else {
      await membersStore.createMember(memberRef.value);
    }
    // Display success message
    toast.success(props.edit ? 'Membre modifié avec succès' : 'Membre ajouté avec succès');

    // close modal if we are in one
    $emit('close');

    // Refresh list & redirect
    await membersStore.fetchMembers();
    router.push({ name: 'members' });
  } catch (error) {
    // Display error message
    toast.error(
      props.edit
        ? 'Une erreur est survenue lors de la modification du membre'
        : "Une erreur est survenue lors de l'ajout du membre"
    );
  }
};

const jobsStore = useJobsStore();

let jobsOptions = ref<{ value: string; label: string }[]>([]);
onMounted(async () => {
  jobsOptions.value = jobsStore.jobs.map((job) => ({
    value: job._id,
    label: job.name
  }));
});
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <InputgroupElement>
      <template #label>
        <LabelElement>Nom</LabelElement>
      </template>
      <template #input>
        <InputElement v-model="memberRef.firstName" :id="'firstName'" />
      </template>
    </InputgroupElement>
    <InputgroupElement>
      <template #label>
        <LabelElement>Prénom</LabelElement>
      </template>
      <template #input>
        <InputElement v-model="memberRef.lastName" :id="'lastName'" />
      </template>
    </InputgroupElement>
    <InputgroupElement class="mb-20">
      <template #label>
        <LabelElement>Poste</LabelElement>
      </template>
      <template #input>
        <SelectElement :options="jobsOptions" v-model="memberRef.job" />
      </template>
    </InputgroupElement>
    <footer class="flex justify-end gap-2 mt-16">
      <ButtonElement @click="$emit('close')">Annuler</ButtonElement>
      <ButtonElement primary type="submit">{{ okText }}</ButtonElement>
    </footer>
  </form>
</template>
