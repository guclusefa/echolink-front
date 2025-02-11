<script setup lang="ts">
import SignalementCard from './SignalementCard.vue';

const props = defineProps({
  signalements: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section class="flex flex-col gap-4">
    <p class="text-sm text-gray">{{ props.signalements.length }} signalements</p>
    <ul
      v-if="props.signalements.length"
      class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <li v-for="signalement in props.signalements" :key="signalement._id">
        <SignalementCard :signalement="signalement" />
      </li>
    </ul>
  </section>
</template>
