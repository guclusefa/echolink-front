<script setup lang="ts">
import ButtonElement from '@/components/elements/ButtonElement.vue';
import SelectElement from '@/components/elements/SelectElement.vue';
import { useCategoriesStore } from '@/stores/categories';
import type { Signalement } from '@/types/Signalement';
import { computed, onMounted, ref } from 'vue';
import SignalementCard from './SignalementCard.vue';

const props = defineProps({
  signalements: {
    type: Array as () => Signalement[],
    required: true
  }
});

const selectedCategory = ref(null); // Default to null instead of ''
const showClosed = ref(false);

const priorityOptions = [
  { value: 'low', label: 'Normal', color: 'bg-blue-100' },
  { value: 'medium', label: 'Urgent', color: 'bg-yellow-100' },
  { value: 'high', label: 'Très urgent', color: 'bg-orange-100' },
  { value: 'urgent', label: 'Critique', color: 'bg-red-100' }
];

const filteredSignalements = computed(() => {
  return props.signalements.filter(s =>
    (selectedCategory.value === null || s.category_id == selectedCategory.value) && // Loose equality for correct filtering
    (showClosed.value ? s.closed_at : !s.closed_at)
  );
});

const groupedSignalements = computed(() => {
  return priorityOptions.map(option => ({
    label: option.label,
    color: option.color,
    signalements: filteredSignalements.value.filter(s => s.priority_level === option.value)
  }));
});

const categoriesStore = useCategoriesStore();
const categoriesOptions = computed(() =>
  categoriesStore.categories.map((category) => ({
    value: category.id,
    label: category.name
  }))
);

onMounted(async () => {
  await categoriesStore.fetchCategories();
});

// Fonction pour réinitialiser les filtres
const resetFilters = () => {
  selectedCategory.value = null;
  showClosed.value = false;
};
</script>

<template>
  <section>
    <p class="text-sm text-gray mb-4">{{ filteredSignalements.length }} signalements</p>

    <div class="flex gap-4 mb-4">
      <div class="flex gap-4">
        <SelectElement v-model="selectedCategory" :options="categoriesOptions" placeholder="Filtrer par catégorie" />
      </div>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="showClosed" /> Cloturés
      </label>
      <ButtonElement @click="resetFilters">Réinitialiser les filtres</ButtonElement>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="group in groupedSignalements" :key="group.label" :class="[group.color, 'p-4 rounded-lg']">
        <h2 class="text-lg font-bold mb-2">{{ group.label }}</h2>
        <ul v-if="group.signalements.length" class="space-y-2">
          <li v-for="signalement in group.signalements" :key="signalement.id">
            <SignalementCard :signalement="signalement" />
          </li>
        </ul>
        <p v-else class="text-gray-500">Aucun signalement</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
}
</style>
