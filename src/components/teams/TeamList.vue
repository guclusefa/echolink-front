<script setup lang="ts">
import TeamCard from './TeamCard.vue';

const props = defineProps({
  teams: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section class="flex flex-col gap-4">
    <p class="text-sm text-gray">{{ props.teams.length }} équipes</p>
    <ul
      v-if="props.teams.length"
      class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <li v-for="team in props.teams" :key="team._id">
        <TeamCard :team="team" />
      </li>
    </ul>
  </section>
</template>
