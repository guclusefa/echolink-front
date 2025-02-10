<script setup lang="ts">
import WrapperElement from '@/components/elements/WrapperElement.vue';
import SectionElement from '@/components/elements/SectionElement.vue';

import LoginForm from '@/components/auth/LoginForm.vue';
</script>

<template>
  <WrapperElement>
    <SectionElement title="Connexion">
      <template #content>
        <LoginForm />
      </template>
    </SectionElement>
  </WrapperElement>
</template>
