<script setup lang="ts">
import InputElement from '@/components/elements/InputElement.vue';
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ButtonElement from '../elements/ButtonElement.vue';
import SpinnerElement from '../elements/SpinnerElement.vue';

const router = useRouter();

const loading = ref(false);

const user = ref({
  email: '',
  password: ''
});

const handleSubmit = async () => {
  if (!user.value.email || !user.value.password) {
    toast.error("Veuillez remplir votre email et votre mot de passe");
    return;
  }
  try {
    loading.value = true;
    await useAuthStore().login({ email: user.value.email, password: user.value.password });
    router.push({ name: 'home' }).then(() => {
      window.location.reload();
    });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      toast.error("Votre compte n'est pas encore vérifié. Veuillez vérifier votre email.");
    } else {
      toast.error("Email ou mot de passe incorrect");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <InputgroupElement>
      <template #label>
        <LabelElement>Email</LabelElement>
      </template>
      <template #input>
        <InputElement :id="'nom'" v-model="user.email" />
      </template>
    </InputgroupElement>
    <InputgroupElement>
      <template #label>
        <LabelElement>Mot de passe</LabelElement>
      </template>
      <template #input>
        <InputElement type="password" :id="'password'" v-model="user.password" />
      </template>
    </InputgroupElement>
    <footer class="flex gap-2">
      <ButtonElement primary type="submit" :disabled="loading">
        <div class="flex items-center gap-2">
          <SpinnerElement v-if="loading" />
          <div>
            Se connecter
          </div>
        </div>
      </ButtonElement>
    </footer>
  </form>
</template>
