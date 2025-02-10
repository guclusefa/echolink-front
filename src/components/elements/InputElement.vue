<script setup lang="ts">
const model = defineModel();
defineProps({
  id: String,
});
</script>

<template>
  <input
    :id="id"
    type="text"
    autocomplete="off"
    class="block w-full p-2 rounded dark:bg-black-lighter bcustom-ring bcustom-ring-focus"
    v-model="model"
  />
</template>
