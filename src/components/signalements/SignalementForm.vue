<script setup lang="ts">
import InputElement from '@/components/elements/InputElement.vue';
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import SelectElement from '@/components/elements/SelectElement.vue';
import { useSignalementsStore } from '@/stores/signalements';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ButtonElement from '../elements/ButtonElement.vue';
import { useCategoriesStore } from '@/stores/categories';
import L from 'leaflet';

const router = useRouter();
const props = defineProps({
  signalement: {
    type: Object as () => { description: string; catId: number; priorityLevel: number; longitude: number; latitude: number },
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

const signalementRef = ref({
  description: '',
  catId: 0,
  priorityLevel: 0,
  longitude: 5.7245,
  latitude: 45.1885,
});

if (props.signalement) {
  signalementRef.value = props.signalement;
}

const $emit = defineEmits(['close']);
const signalementsStore = useSignalementsStore();
const categoriesStore = useCategoriesStore();
const categoriesOptions = ref<{ value: string; label: string }[]>([]);
const priorityOptions = ref<{ value: number; label: string }[]>([
  { value: 1, label: 'Normal' },
  { value: 2, label: 'Urgent' },
  { value: 3, label: 'Très urgent' },
  { value: 4, label: 'Critique' }
]);

// Leaflet Map
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);

onMounted(async () => {
  categoriesOptions.value = categoriesStore.categories.map((category) => ({
    value: category.id as string,
    label: category.name
  }));

  const defaultLat = signalementRef.value.latitude || 45.1885;
  const defaultLng = signalementRef.value.longitude || 5.7245;

  map.value = L.map('map').setView([defaultLat, defaultLng], 13); // Centrage sur la position enregistrée ou Grenoble

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value);

  marker.value = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map.value);

  marker.value.setIcon(
    L.icon({
      iconUrl: '/public/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  );

  map.value.on('click', (e: L.LeafletMouseEvent) => {
    if (marker.value) {
      marker.value.setLatLng(e.latlng);
    }
    signalementRef.value.latitude = e.latlng.lat;
    signalementRef.value.longitude = e.latlng.lng;
  });

  // Mise à jour des coordonnées du signalement si en mode édition
  if (props.edit && signalementRef.value.latitude && signalementRef.value.longitude) {
    marker.value.setLatLng([signalementRef.value.latitude, signalementRef.value.longitude]);
    map.value.setView([signalementRef.value.latitude, signalementRef.value.longitude], 13);
  }
});

const handleSubmit = async () => {
  if (!signalementRef.value.description || !signalementRef.value.latitude || !signalementRef.value.longitude || !signalementRef.value.catId || !signalementRef.value.priorityLevel) {
    toast.error('Veuillez remplir tous les champs et sélectionner un emplacement sur la carte');
    return;
  }

  try {
    if (props.edit && signalementRef.value.id) {
      await signalementsStore.updateSignalement(signalementRef.value);
    } else {
      await signalementsStore.createSignalement(signalementRef.value);
    }

    toast.success(props.edit ? 'Signalement modifié avec succès' : 'Signalement ajouté avec succès');
    $emit('close');
    await signalementsStore.fetchSignalements();
    router.push({ name: 'signalements' });
  } catch (error) {
    toast.error(props.edit ? 'Erreur lors de la modification' : "Erreur lors de l'ajout");
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
        <InputElement v-model="signalementRef.description" id="description" />
      </template>
    </InputgroupElement>

    <div class="flex flex-col gap-2">
      <LabelElement>Localisation</LabelElement>
      <div id="map" style="height: 300px; border-radius: 8px;"></div>
      <div class="text-sm text-gray-600">Cliquez sur la carte pour définir l'emplacement.</div>
    </div>

    <InputgroupElement class="flex-1">
      <template #label>
        <LabelElement>Catégorie</LabelElement>
      </template>
      <template #input>
        <SelectElement :options="categoriesOptions" v-model="signalementRef.catId" />
      </template>
    </InputgroupElement>

    <InputgroupElement>
      <template #label>
        <LabelElement>Priorité</LabelElement>
      </template>
      <template #input>
        <SelectElement :options="priorityOptions" v-model="signalementRef.priorityLevel" />
      </template>
    </InputgroupElement>

    <footer class="flex justify-end gap-2">
      <ButtonElement @click="$emit('close')">Annuler</ButtonElement>
      <ButtonElement primary type="submit">{{ okText }}</ButtonElement>
    </footer>
  </form>
</template>

<style scoped>
#map {
  width: 100%;
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
