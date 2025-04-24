<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import IconElement from './IconElement.vue';

defineProps({
  title: String,
  okText: String,
  okType: {
    type: String,
    default: 'primary'
  }
});

defineEmits(['close', 'validate']);
</script>

<template>
  <TransitionRoot appear as="template" show>
    <Dialog as="div" @close="$emit('close')" class="relative z-[1000]">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-opacity-50 bg-black"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto modal">
        <div class="flex min-h-full items-center justify-center p-2 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="flex flex-col gap-5 w-full max-w-xl transform overflow-hidden p-5 text-left align-middle shadow-xl transition-all bg-white dark:bg-black-lightend"
            >
              <header>
                <DialogTitle as="h3" class="text-lg font-medium leading-6">
                  {{ title }}
                </DialogTitle>
                <div class="absolute top-0 right-0 pt-1 pr-1">
                  <IconElement @click="$emit('close')">
                    <XMarkIcon class="w-5 h-5" aria-hidden="true" />
                  </IconElement>
                </div>
              </header>
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
