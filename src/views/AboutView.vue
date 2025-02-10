<script setup lang="ts">
import WrapperElement from '@/components/elements/WrapperElement.vue';
import SectionElement from '@/components/elements/SectionElement.vue';
</script>

<template>
  <WrapperElement>
    <SectionElement title="À propos">
      <template #content>
        <p class="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </template>
    </SectionElement>
  </WrapperElement>
</template>
