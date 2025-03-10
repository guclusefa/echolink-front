<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import SignalementCard from './SignalementCard.vue';
import SelectElement from '@/components/elements/SelectElement.vue';
import { useCategoriesStore } from '@/stores/categories';
import ButtonElement from '@/components/elements/ButtonElement.vue';
import { PRIORITY_OPTIONS, PRIORITY_COLORS, PRIORITY_LEVELS } from '@/constants/priorities';

const props = defineProps({
  signalements: {
    type: Array,
    required: true
  }
});

const selectedCategory = ref(null);
const showClosed = ref(false);

const filteredSignalements = computed(() => {
  return props.signalements.filter(s =>
    (selectedCategory.value === null || s.category_id == selectedCategory.value) &&
    (showClosed.value ? s.status === 'closed' : s.status !== 'closed')
  );
});

const groupedSignalements = computed(() => {
  return PRIORITY_OPTIONS.map(option => ({
    label: option.label,
    value: option.value,
    color: PRIORITY_COLORS[option.value],
    signalements: filteredSignalements.value.filter(s => s.priority_level === option.value)
  }));
});

const categoriesStore = useCategoriesStore();
const categoriesOptions = computed(() =>
  categoriesStore.categories.map((category) => ({
    value: category.id.toString(),
    label: category.name
  }))
);

onMounted(async () => {
  await categoriesStore.fetchCategories();
});

const resetFilters = () => {
  selectedCategory.value = null;
  showClosed.value = false;
};
</script>

<template>
  <section class="space-y-6">
    <!-- En-tête avec statistiques -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Total</h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ filteredSignalements.length }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">signalements</p>
        </div>
        <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/30">
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">Urgent</h3>
          <p class="text-2xl font-bold text-red-900 dark:text-red-100">
            {{ groupedSignalements.find(g => g.value === PRIORITY_LEVELS.URGENT)?.signalements.length || 0 }}
          </p>
          <p class="text-sm text-red-600 dark:text-red-400">à traiter en priorité</p>
        </div>
        <div class="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/30">
          <h3 class="text-lg font-semibold text-orange-800 dark:text-orange-200">High</h3>
          <p class="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {{ groupedSignalements.find(g => g.value === PRIORITY_LEVELS.HIGH)?.signalements.length || 0 }}
          </p>
          <p class="text-sm text-orange-600 dark:text-orange-400">nécessitent une attention rapide</p>
        </div>
        <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/30">
          <h3 class="text-lg font-semibold text-green-800 dark:text-green-200">Résolus</h3>
          <p class="text-2xl font-bold text-green-900 dark:text-green-100">
            {{ props.signalements.filter(s => s.closed_at).length }}
          </p>
          <p class="text-sm text-green-600 dark:text-green-400">signalements clôturés</p>
        </div>
      </div>
    </div>

    <!-- Barre de filtres -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <SelectElement 
            v-model="selectedCategory" 
            :options="categoriesOptions" 
            placeholder="Toutes les catégories"
            class="min-w-[200px]"
          />
          <div class="flex items-center gap-2">
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="showClosed"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Inclure les signalements clôturés</span>
            </label>
          </div>
        </div>
        <ButtonElement 
          @click="resetFilters"
          class="text-sm w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <span class="material-icons text-lg">restart_alt</span>
          Réinitialiser les filtres
        </ButtonElement>
      </div>
    </div>

    <!-- Liste des signalements -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="group in groupedSignalements" 
        :key="group.value" 
        class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
      >
        <div class="p-4 border-b dark:border-gray-700" :class="[group.color]">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold capitalize">{{ group.label }}</h2>
            <span class="px-3 py-1 text-sm font-medium rounded-full" 
              :class="[
                group.value === PRIORITY_LEVELS.URGENT ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                group.value === PRIORITY_LEVELS.HIGH ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200' :
                group.value === PRIORITY_LEVELS.MEDIUM ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              ]"
            >
              {{ group.signalements.length }}
            </span>
          </div>
        </div>
        
        <div class="divide-y dark:divide-gray-700">
          <div v-if="group.signalements.length" class="divide-y dark:divide-gray-700">
            <div v-for="signalement in group.signalements" :key="signalement.id" class="p-4">
              <SignalementCard :signalement="signalement" />
            </div>
          </div>
          <div v-else class="p-8 text-center">
            <span class="material-icons text-4xl text-gray-400 dark:text-gray-600 mb-2">inbox</span>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Aucun signalement {{ group.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 1.5rem;
}

/* Animation des cartes */
.grid > div {
  transition: transform 0.2s ease-in-out;
}

.grid > div:hover {
  transform: translateY(-2px);
}
</style>
