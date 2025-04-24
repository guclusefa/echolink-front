<script setup lang="ts">
import SignalementCloseButton from './SignalementCloseButton.vue';
import SignalementDeleteButton from './SignalementDeleteButton.vue';
import SignalementEditButton from './SignalementEditButton.vue';

import { useSignalementsStore } from '@/stores/signalements';
import type { Signalement } from '@/types/Signalement';
import L from 'leaflet';
import { computed, onMounted, ref } from 'vue';

import { useAuthStore } from '@/stores/auth';

const signalementsStore = useSignalementsStore();

const props = defineProps({
  signalement: {
    type: Object as () => Signalement,
    required: true
  }
});


const useAuth = useAuthStore();
let user: any = null;
if (useAuth.user) {
  user = useAuth.user;
}

const isContentMine = computed(() => {
  if (!user) return false;
  return user.id === props.signalement.user_id;
});

let signalementId = props.signalement.id;
if (!signalementId) {
  throw new Error('Signalement ID is required');
}

// Gestion de la carte Leaflet
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);

onMounted(() => {
  if (!props.signalement.latitude || !props.signalement.longitude) return;

  map.value = L.map(`map-${signalementId}`).setView(
    [props.signalement.latitude, props.signalement.longitude],
    13
  );

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value);

  marker.value = L.marker([props.signalement.latitude, props.signalement.longitude])
    .addTo(map.value)
    .bindPopup(props.signalement.description)
    .openPopup()
    // icon
    .setIcon(
      L.icon({
        iconUrl: '/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    );
});

const priorityOptions = ref<{ value: string; label: string }[]>([
  { value: 'low', label: 'Normal' },
  { value: 'medium', label: 'Urgent' },
  { value: 'high', label: 'Très urgent' },
  { value: 'urgent', label: 'Critique' }
]);
</script>

<template>
  <article class="p-4 bg-white rounded-lg shadow-xl flex flex-col gap-4 h-full dark:bg-black-lighter"
    v-if="props.signalement.id">
    <RouterLink :to="{ name: 'signalement', params: { id: props.signalement.id } }">
      <header class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">{{ props.signalement.title }}</h3>
      </header>
    </RouterLink>

    <p class="text-sm text-gray-500">{{ props.signalement.description }}</p>
    <p class="text-sm">Catégorie: {{ props.signalement.categoryName }}</p>
    <p class="text-sm">Priorité: {{priorityOptions.find((p) => p.value === props.signalement.priority_level)?.label}}
    </p>

    <!-- Carte Leaflet -->
    <div v-if="props.signalement.latitude && props.signalement.longitude" :id="`map-${signalementId}`"
      class="h-40 w-full rounded-lg border"></div>

    <p class="text-sm" v-if="!props.signalement.closed_at">
      Publié le {{ props.signalement.created_at ?
        new Date(props.signalement.created_at).toLocaleDateString() : 'Date inconnue' }} par {{ props.signalement.userName
      }} {{ props.signalement.userLastName }}
    </p>

    <p class="text-sm" v-if="props.signalement.closed_at">
      Fermé le {{ props.signalement.closed_at ?
        new Date(props.signalement.closed_at).toLocaleDateString() : 'Date inconnue' }} par {{ props.signalement.userName
      }} {{ props.signalement.userLastName }}
    </p>

    <footer class="flex items-center gap-2" v-if="isContentMine && !props.signalement.closed_at">
      <SignalementEditButton :signalement="props.signalement" />
      <SignalementDeleteButton :signalement="props.signalement" />
      <SignalementCloseButton :signalement="props.signalement" />
    </footer>
  </article>
</template>

<style scoped>
/* Taille fixe pour la carte */
div[id^="map-"] {
  height: 200px;
  border-radius: 8px;
}
</style>
