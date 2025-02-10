<script setup lang="ts">
import { setDocumentLang, setDocumentTitle } from '@/utils/document';
import { getAvailableLocales, getCurrentLocale, setLocale } from '@/utils/i18n';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SelectElement from '../elements/SelectElement.vue';

const locale = ref(getCurrentLocale());
const route = useRoute();

// turn getAvailableLocales() into an array of SelectOption
const localesOptions: SelectOption[] = Object.entries(getAvailableLocales()).map(
  ([key, value]) => ({
    value: key,
    label: value
  })
);

const changeLocale = () => {
  setLocale(locale.value);
  setDocumentTitle(route.name as string);
  setDocumentLang(locale.value);
};

onMounted(() => {
  setDocumentLang(locale.value);
});

watch(locale, () => {
  changeLocale();
});
</script>

<template>
  <SelectElement v-model="locale" :options="localesOptions" />
</template>
