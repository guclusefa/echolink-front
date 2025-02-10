<script setup lang="ts">
import MemberCard from './MemberCard.vue';

const props = defineProps({
  members: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section class="flex flex-col gap-4">
    <p class="text-sm text-gray">{{ props.members.length }} travailleurs trouvés</p>
    <ul
      v-if="props.members.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <li v-for="member in props.members" :key="member._id">
        <MemberCard :member="member" />
      </li>
    </ul>
  </section>
</template>
