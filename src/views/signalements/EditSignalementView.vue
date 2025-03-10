<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useSignalementsStore } from '@/stores/signalements';
import { useCategoriesStore } from '@/stores/categories';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import L from 'leaflet';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import ButtonElement from '@/components/elements/ButtonElement.vue';
import 'leaflet/dist/leaflet.css';
import { PRIORITY_OPTIONS } from '@/constants/priorities';
import SelectElement from '@/components/elements/SelectElement.vue';

const router = useRouter();
const signalementsStore = useSignalementsStore();
const categoriesStore = useCategoriesStore();

const description = ref('');
const categoryId = ref<number | null>(null);
const priorityLevel = ref<string | null>(null);
const latitude = ref<number | null>(null);
const longitude = ref<number | null>(null);
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);

const priorityOptions = PRIORITY_OPTIONS;

const initializeFormData = (signalement: any) => {
  description.value = signalement.description || '';
  categoryId.value = signalement.category_id ? Number(signalement.category_id) : null;
  priorityLevel.value = signalement.priority_level || 'low';
  latitude.value = signalement.latitude || null;
  longitude.value = signalement.longitude || null;

  console.log('Valeurs actuelles du signalement:', {
    description: signalement.description,
    categoryId: signalement.category_id,
    priorityLevel: signalement.priority_level,
    latitude: signalement.latitude,
    longitude: signalement.longitude
  });
};

const initializeMap = async () => {
  try {
    await nextTick();
    
    if (map.value) {
      map.value.remove();
    }

    map.value = L.map('edit-map').setView([latitude.value || 46.603354, longitude.value || 1.888334], latitude.value && longitude.value ? 13 : 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.value);
    
    if (latitude.value && longitude.value) {
      marker.value = L.marker([latitude.value, longitude.value], {
        draggable: true
      }).addTo(map.value);
      
      marker.value.on('dragend', function(e) {
        const position = e.target.getLatLng();
        latitude.value = position.lat;
        longitude.value = position.lng;
      });
    }
    
    map.value.on('click', function(e) {
      const position = e.latlng;
      latitude.value = position.lat;
      longitude.value = position.lng;
      
      if (marker.value) {
        marker.value.setLatLng(position);
      } else {
        marker.value = L.marker(position, {
          draggable: true
        }).addTo(map.value);
        
        marker.value.on('dragend', function(e) {
          const pos = e.target.getLatLng();
          latitude.value = pos.lat;
          longitude.value = pos.lng;
        });
      }
    });

    setTimeout(() => {
      map.value?.invalidateSize();
    }, 100);
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la carte:', error);
    toast.error('Erreur lors de l\'initialisation de la carte');
  }
};

onMounted(async () => {
  const id = router.currentRoute.value.params.id as string;
  console.log('ID du signalement à éditer:', id);
  
  try {
    console.log('Chargement des catégories...');
    await categoriesStore.fetchCategories();
    
    console.log('Chargement du signalement...');
    await signalementsStore.fetchSignalement(id);
    
    const signalement = signalementsStore.signalement;
    console.log('Signalement chargé:', signalement);
    
    if (!signalement || !signalement.id) {
      console.error('Signalement non trouvé');
      toast.error('Signalement non trouvé');
      router.push({ name: 'signalements' });
      return;
    }

    await nextTick();
    initializeFormData(signalement);

    await initializeMap();
  } catch (error) {
    console.error('Erreur détaillée lors du chargement:', error);
    toast.error('Erreur lors du chargement du signalement. Veuillez réessayer.');
  }
});

const updateSignalement = async () => {
  try {
    if (!latitude.value || !longitude.value) {
      toast.error('Veuillez sélectionner un emplacement sur la carte');
      return;
    }

    const updateData = {
      id: signalementsStore.signalement.id,
      description: description.value,
      category_id: categoryId.value,
      priority_level: priorityLevel.value,
      latitude: Number(latitude.value),
      longitude: Number(longitude.value)
    };

    console.log('Données à mettre à jour:', updateData);
    await signalementsStore.updateSignalement(updateData);
    toast.success('Signalement mis à jour avec succès');
    router.push({ name: 'signalements' });
  } catch (error) {
    toast.error('Erreur lors de la mise à jour du signalement');
    console.error('Erreur lors de la mise à jour:', error);
  }
};
</script>

<template>
  <WrapperElement>
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Modifier le signalement
      </h1>

      <form @submit.prevent="updateSignalement" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Description
          </label>
          <textarea
            v-model="description"
            rows="3"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Catégorie
          </label>
          <select
            v-model="categoryId"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option v-for="category in categoriesStore.categories" 
                    :key="category.id" 
                    :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Niveau de priorité
          </label>
          <select
            v-model="priorityLevel"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option v-for="option in priorityOptions" 
                    :key="option.value" 
                    :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Localisation
          </label>
          <div id="edit-map" class="h-96 w-full rounded-lg mb-2 border border-gray-300"></div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Cliquez sur la carte ou déplacez le marqueur pour modifier l'emplacement.
          </p>
        </div>

        <div class="flex justify-end gap-4 pt-6">
          <ButtonElement type="button" @click="router.back()">
            Annuler
          </ButtonElement>
          <ButtonElement type="submit" primary>
            Enregistrer les modifications
          </ButtonElement>
        </div>
      </form>
    </div>
  </WrapperElement>
</template>

<style>
@import 'leaflet/dist/leaflet.css';

#edit-map {
  z-index: 1;
  width: 100%;
  height: 400px;
  border-radius: 0.5rem;
}

.leaflet-default-icon-path {
  background-image: url("https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png");
}

.leaflet-control-container .leaflet-control {
  z-index: 1;
}
</style> 