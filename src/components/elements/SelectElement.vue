<script setup lang="ts">
import { randomString } from '@/utils/random';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid';
import { onMounted, ref, type Ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array<String | Number | Boolean>],
    required: true
  },
  options: {
    type: Array<SelectOption>,
    required: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default() {
      return randomString();
    }
  },
  class: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);

// ref of select
const select: Ref<typeof Listbox | null> = ref(null);

const optionsOnTop: Ref<boolean> = ref(false);
const optionsHeight: Ref<number> = ref(200);

function calculateOptionsSizeAndPosition() {
  const topbarHeight = 50;
  const minPossileHeight = 32;
  const maxPossileHeight = 192;

  // extract the div element from the ref
  if (!select.value || !select.value.$el || !select.value.$el.nextElementSibling) {
    return;
  }
  const el = select.value.$el.nextElementSibling as HTMLDivElement;
  const rect = el.getBoundingClientRect();

  // get the space above and below the element (for the spaceAbove we need to subtract the topbarHeight)
  // and get the highest space
  const spaceAbove = rect.top - topbarHeight;
  const spaceBelow = window.innerHeight - rect.bottom;
  const highestSpace = Math.max(spaceAbove, spaceBelow);

  // if the options can be show below, always show them below otherwise show them on the highest space
  optionsOnTop.value = spaceBelow >= maxPossileHeight ? false : highestSpace === spaceAbove;
  // if in a modal, always shos on top (check if in "modal" class is present in one of the parents)
  optionsOnTop.value = document.querySelector('.modal') ? true : optionsOnTop.value;
  // calculate the height of the options and make sure it is between the min and max possible height
  optionsHeight.value = Math.min(
    Math.max(Math.min(highestSpace - minPossileHeight, maxPossileHeight), minPossileHeight),
    maxPossileHeight
  );
}

onMounted(() => {
  // calculate the options on top and the button width on mounted
  calculateOptionsSizeAndPosition();
  window.addEventListener('resize', calculateOptionsSizeAndPosition);
});

function getSelectedLabel() {
 
  return props.options.find((option) => option.value === props.modelValue)?.label;
}
</script>

<template>
  <Listbox
    ref="select"
    as="div"
    class="w-full relative"
    v-slot="{ open }"
    :multiple="multiple"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <ListboxButton
      :id="props.id"
      class="w-full p-2 rounded dark:bg-black-lighter bcustom-ring bcustom-ring-focus"
      :class="[
        open
          ? 'ring-2 !ring-primary-500 ' + (optionsOnTop ? 'rounded-t-none' : 'rounded-b-none')
          : ''
      ]"
    >
      <div class="flex items-center justify-between gap-1">
        <span :class="{ 'text-gray-400': !getSelectedLabel() }">
          {{ getSelectedLabel() ? getSelectedLabel() : placeholder }}
        </span>
        <span class="w-5 h-5">
          <ChevronUpDownIcon class="w-5 h-5" aria-hidden="true" />
        </span>
      </div>
    </ListboxButton>

    <ListboxOptions
      class="overflow-auto z-50 absolute left-0 right-0 rounded bg-white dark:bg-black-lighter shadow bcustom-ring"
      :class="[optionsOnTop ? 'bottom-full rounded-b-none' : 'top-full rounded-t-none']"
      :style="{
        maxHeight: `${optionsHeight}px`
      }"
    >
      <ListboxOption
        v-slot="{ active, selected }"
        v-for="option in options"
        :key="option.value.toString()"
        :value="option.value"
        as="template"
      >
        <li
          class="flex items-center gap-2 p-2 cursor-pointer"
          :class="{
            'bg-white-darkend dark:bg-black-lightest': active && !selected,
            'font-semibold text-white bg-primary ': selected,
            'bg-primary-darkest': active && selected
          }"
        >
          <span class="truncate">
            {{ option.label }}
          </span>
        </li>
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>
