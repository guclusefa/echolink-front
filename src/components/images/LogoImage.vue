<script setup lang="ts">
import { getAppName } from '@/utils/app';
</script>
<template>
  <img
    src="@/assets/images/logo.svg"
    class="h-10 object-cover"
    :alt="getAppName()"
  />
</template>
