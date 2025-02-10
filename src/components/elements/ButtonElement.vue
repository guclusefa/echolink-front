<script setup lang="ts">
const props = defineProps({
  primary: {
    type: Boolean,
    default: false
  },
  secondary: {
    type: Boolean,
    default: false
  },
  danger: {
    type: Boolean,
    default: false
  },
  warning: {
    type: Boolean,
    default: false
  },
  bordered: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <button
    type="button"
    class="font-semibold py-2 px-2.5 rounded"
    :class="{
      'hover:bg-white-darkend dark:hover:bg-black-lighter': !props.primary && !props.secondary && !props.danger && !props.warning,
      'text-white bg-primary hover:bg-primary-darkest': props.primary,
      'text-white bg-secondary hover:bg-secondary-darkest': props.secondary,
      'text-white bg-danger hover:bg-danger-darkest': props.danger,
      'text-white bg-yellow-500 hover:bg-warning-darkest': props.warning,
      'cursor-not-allowed opacity-50': props.disabled,
      'bcustom-ring': props.bordered
    }"
  >
    <slot></slot>
  </button>
</template>
