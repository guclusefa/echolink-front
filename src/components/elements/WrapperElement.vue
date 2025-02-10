<script setup lang="ts">
const props = defineProps({
  paddingHorizontal: {
    type: Boolean,
    default: true
  },
  paddingVertical: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <div :class="{ 'px-2 sm:px-2': props.paddingHorizontal, 'py-2.5': props.paddingVertical }">
    <slot></slot>
  </div>
</template>
