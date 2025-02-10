<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <section>
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-semibold">{{ props.title }}</h1>
      <slot name="actions" />
    </div>
    <hr class="my-4" />
    <slot name="content" />
  </section>
</template>
