<script setup lang="ts">
import { useSignalementsStore } from '@/stores/signalements';
import type { Signalement } from '@/types/Signalement';
import { onMounted, ref, computed } from 'vue';
import L from 'leaflet';
import { useAuthStore } from '@/stores/auth';
import ButtonElement from '@/components/elements/ButtonElement.vue';
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';
import 'leaflet/dist/leaflet.css';
import { PRIORITY_CLASSES, PRIORITY_LABELS, PRIORITY_BANNER_CLASSES } from '@/constants/priorities';

const router = useRouter();
const props = defineProps({
  signalement: {
    type: Object as () => Signalement,
    required: true
  }
});

const signalementsStore = useSignalementsStore();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const isContentMine = computed(() => user.value?.id === props.signalement.user_id);
const distance = ref<number | null>(null);

const calculateDistance = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      const R = 6371;
      const dLat = (props.signalement.latitude - userLat) * (Math.PI / 180);
      const dLon = (props.signalement.longitude - userLon) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * (Math.PI / 180)) *
          Math.cos(props.signalement.latitude * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distance.value = Math.round(R * c * 10) / 10;
    });
  }
};

const goToChat = () => {
  console.log('Signalement:', props.signalement);
  console.log('ID:', props.signalement.id);

  if (!props.signalement.id) {
    return;
  }

  const chatId = props.signalement.id.toString();
  console.log('Chat ID:', chatId);

  router
    .push({
      name: 'chat',
      params: { id: chatId },
      state: {
        description: props.signalement.description
      }
    })
    .catch((err) => {
      console.error('Erreur de navigation:', err);
      toast.error('Erreur lors de la redirection vers le chat');
    });
};

const initMap = () => {
  if (!props.signalement.latitude || !props.signalement.longitude) return;

  const mapElement = document.getElementById(`map-${props.signalement.id}`);
  if (!mapElement) return;

  const map = L.map(mapElement).setView(
    [props.signalement.latitude, props.signalement.longitude],
    13
  );

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker([props.signalement.latitude, props.signalement.longitude])
    .addTo(map)
    .bindPopup(props.signalement.description);

  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
};

onMounted(() => {
  calculateDistance();
  setTimeout(() => {
    initMap();
  }, 100);
});

const formatDate = (date: string | undefined) => {
  if (!date) return 'Date inconnue';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getPriorityClass = (priority: string) => {
  return PRIORITY_CLASSES[priority as keyof typeof PRIORITY_CLASSES] || PRIORITY_CLASSES.low;
};

const getPriorityLabel = (priority: string) => {
  return PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS] || PRIORITY_LABELS.low;
};

const getPriorityBannerClass = (priority: string) => {
  return (
    PRIORITY_BANNER_CLASSES[priority as keyof typeof PRIORITY_BANNER_CLASSES] ||
    PRIORITY_BANNER_CLASSES.low
  );
};

const handleEdit = () => {
  router.push(`/signalements/${props.signalement.id}/edit`);
};

const handleDelete = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce signalement ?')) return;

  try {
    await signalementsStore.deleteSignalement(props.signalement.id);
    toast.success('Signalement supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    toast.error('Erreur lors de la suppression du signalement');
  }
};

const handleClose = async () => {
  if (!confirm('Êtes-vous sûr de vouloir clôturer ce signalement ?')) return;

  try {
    const signalementId = props.signalement.id.toString();
    await signalementsStore.closeSignalement(signalementId);
    await signalementsStore.fetchSignalements();
    toast.success('Signalement clôturé avec succès');
  } catch (error) {
    console.error('Erreur lors de la clôture:', error);
    toast.error('Erreur lors de la clôture du signalement');
  }
};
</script>

<template>
  <article
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
    v-if="props.signalement.id"
  >
    <div class="relative">
      <div
        class="absolute top-0 left-0 right-0 h-1"
        :class="[getPriorityBannerClass(props.signalement.priority_level)]"
      ></div>

      <div class="p-4 pt-5">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-lg font-medium line-clamp-2 flex-1">
            {{ props.signalement.description }}
          </h3>
          <div class="flex flex-col items-end gap-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="[getPriorityClass(props.signalement.priority_level)]"
            >
              {{ getPriorityLabel(props.signalement.priority_level) }}
            </span>
            <span
              v-if="distance !== null"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
            >
              <span class="material-icons text-sm mr-1">place</span>
              {{ distance }}km
            </span>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span
            v-if="props.signalement.categoryName"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          >
            {{ props.signalement.categoryName }}
          </span>
          <span class="flex items-center">
            <span class="material-icons text-sm mr-1">schedule</span>
            {{ formatDate(props.signalement.created_at) }}
          </span>
          <span
            v-if="props.signalement.userName && props.signalement.userLastName"
            class="flex items-center"
          >
            <span class="material-icons text-sm mr-1">person</span>
            {{ props.signalement.userName }} {{ props.signalement.userLastName }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="props.signalement.latitude && props.signalement.longitude"
      :id="`map-${props.signalement.id}`"
      class="h-40 w-full border-t border-b border-gray-200 dark:border-gray-700"
    ></div>

    <div class="p-4 flex flex-wrap items-center gap-2">
      <div class="flex-1">
        <span
          v-if="props.signalement.closed_at"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
        >
          <span class="material-icons text-sm mr-1">lock</span>
          Clôturé le {{ formatDate(props.signalement.closed_at) }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2">
        <template v-if="isContentMine && !props.signalement.closed_at">
          <ButtonElement class="!px-3 !py-1.5" secondary @click="handleEdit">
            <span class="material-icons text-sm">edit</span>
          </ButtonElement>
          <ButtonElement class="!px-3 !py-1.5" danger @click="handleDelete">
            <span class="material-icons text-sm">delete</span>
          </ButtonElement>
          <ButtonElement class="!px-3 !py-1.5" danger @click="handleClose">
            <span class="material-icons text-sm">lock</span>
          </ButtonElement>
          <ButtonElement
            primary
            class="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            @click="goToChat"
          >
            <span class="material-icons text-sm">chat</span>
            Chat
          </ButtonElement>
        </template>

        <template v-else-if="!isContentMine && !props.signalement.closed_at">
          <ButtonElement
            primary
            class="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            @click="goToChat"
          >
            <span class="material-icons text-sm">volunteer_activism</span>
            Aider
          </ButtonElement>
        </template>

        <template v-if="props.signalement.closed_at">
          <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span class="material-icons text-sm mr-1">chat_disabled</span>
            Chat fermé
          </span>
        </template>
      </div>
    </div>
  </article>
</template>

<style scoped>
div[id^='map-'] {
  height: 160px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

article {
  transition: all 0.2s ease-in-out;
}

article:hover {
  transform: translateY(-2px);
}

.material-icons {
  font-size: 16px !important;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
