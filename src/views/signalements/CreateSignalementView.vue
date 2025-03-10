<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import InputElement from '@/components/elements/InputElement.vue';
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import ButtonElement from '@/components/elements/ButtonElement.vue';
import SelectElement from '@/components/elements/SelectElement.vue';
import { useCategoriesStore } from '@/stores/categories';
import { useSignalementsStore } from '@/stores/signalements';
import { useAuthStore } from '@/stores/auth';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PRIORITY_OPTIONS } from '@/constants/priorities';

const router = useRouter();
const loading = ref(false);
const categoriesStore = useCategoriesStore();
const signalementsStore = useSignalementsStore();
const authStore = useAuthStore();

const priorityOptions = PRIORITY_OPTIONS;

let map: L.Map | null = null;
let marker: L.Marker | null = null;

const signalement = ref({
  title: '',
  description: '',
  category_id: '',
  priority_level: 'medium',
  latitude: '',
  longitude: ''
});

const categoriesOptions = computed(() => 
  categoriesStore.categories.map(category => ({
    value: category.id,
    label: category.name
  }))
);

const initMap = () => {
  if (!map) {
    map = L.map('map').setView([46.603354, 1.888334], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      signalement.value.latitude = lat.toString();
      signalement.value.longitude = lng.toString();
      
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }
      
      toast.success('Position mise à jour');
    });
  }
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        signalement.value.latitude = latitude.toString();
        signalement.value.longitude = longitude.toString();
        
        if (map) {
          map.setView([latitude, longitude], 15);
          if (marker) {
            marker.setLatLng([latitude, longitude]);
          } else {
            marker = L.marker([latitude, longitude]).addTo(map);
          }
        }
        
        toast.success('Localisation récupérée avec succès');
      },
      (error) => {
        toast.error('Impossible de récupérer la localisation');
      }
    );
  } else {
    toast.error('La géolocalisation n\'est pas supportée par votre navigateur');
  }
};

const loadCategories = async () => {
  try {
    await categoriesStore.fetchCategories();
  } catch (error) {
    toast.error('Erreur lors du chargement des catégories');
  }
};

const handleSubmit = async () => {
  if (!authStore.token) {
    console.error('Utilisateur non connecté');
    toast.error('Vous devez être connecté pour créer un signalement');
    router.push('/login');
    return;
  }

  console.log('Valeurs actuelles:', {
    title: signalement.value.title,
    description: signalement.value.description,
    category_id: signalement.value.category_id,
    priority_level: signalement.value.priority_level,
    latitude: signalement.value.latitude,
    longitude: signalement.value.longitude
  });

  if (!signalement.value.title || !signalement.value.description || !signalement.value.category_id) {
    console.error('Champs manquants:', {
      title: !signalement.value.title,
      description: !signalement.value.description,
      category_id: !signalement.value.category_id
    });
    toast.error('Veuillez remplir tous les champs obligatoires');
    return;
  }

  if (!signalement.value.latitude || !signalement.value.longitude) {
    console.error('Position manquante:', {
      latitude: !signalement.value.latitude,
      longitude: !signalement.value.longitude
    });
    toast.error('Veuillez sélectionner un emplacement sur la carte');
    return;
  }

  try {
    loading.value = true;
    const signalementData = {
      title: signalement.value.title.trim(),
      description: signalement.value.description.trim(),
      latitude: parseFloat(signalement.value.latitude),
      longitude: parseFloat(signalement.value.longitude),
      category_id: parseInt(signalement.value.category_id),
      priority_level: signalement.value.priority_level || 'medium'
    };
    
    console.log('Données envoyées:', signalementData);
    const response = await signalementsStore.createSignalement(signalementData);
    console.log('Réponse du serveur:', response);
    toast.success('Signalement créé avec succès');
    router.push('/signalements');
  } catch (error: any) {
    console.error('Erreur création signalement:', error);
    console.error('Détails de l\'erreur:', {
      response: error.response?.data,
      status: error.response?.status,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      toast.error('Session expirée, veuillez vous reconnecter');
      router.push('/login');
      return;
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création du signalement';
    toast.error(errorMessage);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCategories();
  initMap();
  getLocation();
});
</script>

<template>
  <WrapperElement>
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Créer un signalement</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <InputgroupElement>
              <template #label>
                <LabelElement>Titre</LabelElement>
              </template>
              <template #input>
                <InputElement v-model="signalement.title" placeholder="Ex: Arbre tombé sur la route" />
              </template>
            </InputgroupElement>

            <InputgroupElement>
              <template #label>
                <LabelElement>Description</LabelElement>
              </template>
              <template #input>
                <textarea
                  v-model="signalement.description"
                  rows="4"
                  class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez la situation en détail..."
                ></textarea>
              </template>
            </InputgroupElement>

            <InputgroupElement>
              <template #label>
                <LabelElement>Catégorie</LabelElement>
              </template>
              <template #input>
                <SelectElement 
                  v-model="signalement.category_id"
                  :options="categoriesOptions"
                  placeholder="Sélectionnez une catégorie"
                />
              </template>
            </InputgroupElement>

            <InputgroupElement>
              <template #label>
                <LabelElement>Niveau de priorité</LabelElement>
              </template>
              <template #input>
                <SelectElement 
                  v-model="signalement.priority_level"
                  :options="priorityOptions"
                  placeholder="Sélectionnez un niveau de priorité"
                />
              </template>
            </InputgroupElement>

            <div class="flex justify-end gap-4">
              <ButtonElement type="button" @click="router.back()">Annuler</ButtonElement>
              <ButtonElement primary type="submit" :disabled="loading">
                {{ loading ? 'Création...' : 'Créer le signalement' }}
              </ButtonElement>
            </div>
          </form>
        </div>

        <div class="space-y-4">
          <div class="flex items-center gap-4 mb-4">
            <ButtonElement type="button" @click="getLocation">
              <span class="material-icons mr-2">location_on</span>
              Ma position actuelle
            </ButtonElement>
            <span v-if="signalement.latitude && signalement.longitude" class="text-sm text-gray-600">
              Position sélectionnée
            </span>
          </div>
          
          <div id="map" class="h-[400px] w-full rounded-lg border border-gray-300"></div>
          <p class="text-sm text-gray-600">Cliquez sur la carte pour sélectionner l'emplacement du signalement</p>
        </div>
      </div>
    </div>
  </WrapperElement>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

:deep(.leaflet-container) {
  z-index: 1;
}
</style> 