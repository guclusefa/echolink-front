<script setup lang="ts">
import InputElement from '@/components/elements/InputElement.vue';
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ButtonElement from '../elements/ButtonElement.vue';
import SelectElement from '../elements/SelectElement.vue';
import SpinnerElement from '../elements/SpinnerElement.vue';

const router = useRouter();

const loading = ref(false);

const user = ref({
  email: '',
  name: '',
  lastName: '',
  password: '',
  passwordConfirmation: '',
  longitude: '',
  latitude: '',
});

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        user.value.latitude = position.coords.latitude.toString();
        user.value.longitude = position.coords.longitude.toString();
        toast.success('Localisation récupérée avec succès');
      },
      (error) => {
        toast.error('Impossible de récupérer la localisation');
      }
    );
  } else {
    toast.error('La géolocalisation est n\'pas supportée par votre navigateur');
  }
};

const handleSubmit = async () => {
  if (!user.value.email || !user.value.password || !user.value.passwordConfirmation || !user.value.name || !user.value.lastName) {
    toast.error('Veuillez remplir les champs obligatoires');
    return;
  }
  if (user.value.password !== user.value.passwordConfirmation) {
    toast.error('Les mots de passe ne correspondent pas');
    return;
  }
  try {
    loading.value = true;
    await useAuthStore().register({
      email: user.value.email,
      name: user.value.name,
      lastName: user.value.lastName,
      password: user.value.password,
      latitude: user.value.latitude,
      longitude: user.value.longitude,
    });
    router.push({ name: 'home' }).then(() => {
      toast.success('Un email de confirmation vous a été envoyé');
    });
  } catch (error) {
    toast.error('Cette adresse email ou nom d\'utilisateur est déjà utilisée');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <div class="flex flex-col sm:flex-row gap-3">
      <InputgroupElement class="flex-1">
        <template #label>
          <LabelElement>Email</LabelElement>
        </template>
        <template #input>
          <InputElement type="email" :id="'email'" v-model="user.email" />
        </template>
      </InputgroupElement>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <InputgroupElement class="flex-1">
        <template #label>
          <LabelElement>Prénom</LabelElement>
        </template>
        <template #input>
          <InputElement type="text" :id="'name'" v-model="user.name" />
        </template>
      </InputgroupElement>
      <InputgroupElement class="flex-1">
        <template #label>
          <LabelElement>Nom</LabelElement>
        </template>
        <template #input>
          <InputElement type="text" :id="'lastName'" v-model="user.lastName" />
        </template>
      </InputgroupElement>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <InputgroupElement class="flex-1">
        <template #label>
          <LabelElement>Mot de passe</LabelElement>
        </template>
        <template #input>
          <InputElement type="password" :id="'password'" v-model="user.password" />
        </template>
      </InputgroupElement>
      <InputgroupElement class="flex-1">
        <template #label>
          <LabelElement>Confirmation du mot de passe</LabelElement>
        </template>
        <template #input>
          <InputElement
            type="password"
            :id="'passwordConfirmation'"
            v-model="user.passwordConfirmation"
          />
        </template>
      </InputgroupElement>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <ButtonElement type="button" @click="getLocation">Obtenir ma localisation</ButtonElement>
      <span v-if="user.latitude && user.longitude" class="text-sm text-gray">
        Latitude: {{ user.latitude }}, Longitude: {{ user.longitude }}
      </span>
    </div>
    <div class="flex items-center gap-2">
      <input type="checkbox" class="form-checkbox" />
      <span class="text-sm text-gray">Accepter les conditions d'utilisation</span>
    </div>
    <footer class="flex gap-2">
      <ButtonElement primary type="submit">
        <div class="flex items-center gap-2">
          <SpinnerElement v-if="loading" />
          <div>S'inscrire</div>
        </div>
      </ButtonElement>
    </footer>
  </form>
</template>
