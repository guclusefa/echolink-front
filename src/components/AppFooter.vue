<script setup lang="ts">
import { getAppName, getAppVersion } from '@/utils/app';
import WrapperElement from './elements/WrapperElement.vue';
</script>

<template>
  <footer
    id="footer"
    class="text-xs bg-white dark:bg-black-lightend shadow-[0_0_10px_#f2f2f2] dark:shadow-[0_0_10px_#000000] mt-10"
  >
    <WrapperElement>
      <nav class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div>&copy; 2025 {{ getAppName() }}</div>
        </div>
        <div class="flex items-center gap-3">
          <div>[V.{{ getAppVersion() }}]</div>
        </div>
      </nav>
    </WrapperElement>
  </footer>
</template>
