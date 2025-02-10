<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline';
import { useDark, useToggle } from '@vueuse/core';
import { computed } from 'vue';
import IconElement from '../elements/IconElement.vue';

const isDark = useDark();
const toggleDark = useToggle(isDark);

const theme = computed(() => (isDark.value ? 'Dark' : 'Light'));
const icon = computed(() => (isDark.value ? MoonIcon : SunIcon));
</script>

<template>
  <IconElement @click="toggleDark()" :title="theme" class="!p-2">
    <component :is="icon" class="w-6 h-6" />
  </IconElement>
</template>
