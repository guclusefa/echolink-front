<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import SignalementCard from './SignalementCard.vue';
import SelectElement from '@/components/elements/SelectElement.vue';
import { useCategoriesStore } from '@/stores/categories';

const props = defineProps({
  signalements: {
    type: Array,
    required: true
  }
});

const selectedCategory = ref(null); // Default to null instead of ''
const showClosed = ref(false);

const priorityOptions = [
  { value: 1, label: 'Normal', color: 'bg-blue-100' },
  { value: 2, label: 'Urgent', color: 'bg-yellow-100' },
  { value: 3, label: 'Très urgent', color: 'bg-orange-100' },
  { value: 4, label: 'Critique', color: 'bg-red-100' }
];

const filteredSignalements = computed(() => {
  return props.signalements.filter(s => 
    (selectedCategory.value === null || s.categoryId == selectedCategory.value) && // Loose equality for correct filtering
    (showClosed.value ? s.closed_at : !s.closed_at)
  );
});

const groupedSignalements = computed(() => {
  return priorityOptions.map(option => ({
    label: option.label,
    color: option.color,
    signalements: filteredSignalements.value.filter(s => s.priorityLevel === option.value)
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
</script>

<template>
  <section>
    <p class="text-sm text-gray mb-4">{{ filteredSignalements.length }} signalements</p>
    
    <div class="flex gap-4 mb-4">
      <SelectElement v-model="selectedCategory" :options="categoriesOptions" placeholder="Filtrer par catégorie" />
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="showClosed" /> Afficher les signalements fermés
      </label>
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
