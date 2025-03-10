<script setup lang="ts">
import WrapperElement from '@/components/elements/WrapperElement.vue';
import { useAuthStore } from '@/stores/auth';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
</script>

<template>
  <div class="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
    <div class="container mx-auto text-center px-4">
      <h1 class="text-4xl md:text-6xl font-bold mb-4">EchoLink</h1>
      <p class="text-lg md:text-2xl mb-6">
        Plateforme d'entraide citoyenne pour les situations d'urgence
      </p>
      <p class="text-md md:text-xl mb-8 max-w-2xl mx-auto">
        Signalez des incidents, trouvez de l'aide ou aidez les autres en temps réel dans votre zone
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink 
          to="/signalements/create" 
          class="bg-white text-red-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-red-50 transition duration-300 flex items-center justify-center gap-2"
        >
          <span class="material-icons">warning</span>
          Signaler une urgence
        </RouterLink>
        
        <RouterLink 
          to="/signalements" 
          class="bg-red-700 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-red-600 transition duration-300 flex items-center justify-center gap-2"
        >
          <span class="material-icons">map</span>
          Voir les signalements
        </RouterLink>
      </div>
    </div>
  </div>

  <WrapperElement>
    <div id="main-content" class="text-center py-8">
      <h2 class="text-2xl font-bold mb-4">Comment ça marche ?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div>
          <div class="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span class="material-icons text-red-600">location_on</span>
          </div>
          <h3 class="font-semibold mb-2">Localisez</h3>
          <p class="text-gray-600">Identifiez les incidents et besoins d'aide près de chez vous</p>
        </div>
        <div>
          <div class="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span class="material-icons text-red-600">add_alert</span>
          </div>
          <h3 class="font-semibold mb-2">Signalez</h3>
          <p class="text-gray-600">Créez rapidement un signalement géolocalisé</p>
        </div>
        <div>
          <div class="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span class="material-icons text-red-600">group</span>
          </div>
          <h3 class="font-semibold mb-2">Entraidez-vous</h3>
          <p class="text-gray-600">Répondez aux besoins de votre communauté</p>
        </div>
      </div>
    </div>
  </WrapperElement>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
