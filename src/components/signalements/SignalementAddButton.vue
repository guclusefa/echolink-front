<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToCreatePage = () => {
  router.push('/signalements/create');
};
</script>

<template>
  <ButtonElement 
    class="add-signalement-btn bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold"
    @click="goToCreatePage"
  >
    <span class="material-icons text-xl">add_circle</span>
    Ajouter un signalement
  </ButtonElement>
</template>

<style scoped>
.add-signalement-btn {
  position: relative;
  overflow: hidden;
}

.add-signalement-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.add-signalement-btn:hover::before {
  left: 100%;
}

@media (max-width: 640px) {
  .add-signalement-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
