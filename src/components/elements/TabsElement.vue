<script setup lang="ts">
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
import { ref, type Ref } from 'vue';

const categories: Ref<Record<string, any[]>> = ref({
  Recent: [
    {
      id: 1,
      title: 'Does drinking coffee make you smarter?',
      date: '5h ago',
      commentCount: 5,
      shareCount: 2
    },
    {
      id: 2,
      title: "So you've bought coffee... now what?",
      date: '2h ago',
      commentCount: 3,
      shareCount: 2
    }
  ],
  Popular: [
    {
      id: 1,
      title: 'Is tech making coffee better or worse?',
      date: 'Jan 7',
      commentCount: 29,
      shareCount: 16
    },
    {
      id: 2,
      title: 'The most innovative things happening in coffee',
      date: 'Mar 19',
      commentCount: 24,
      shareCount: 12
    }
  ],
  Trending: [
    {
      id: 1,
      title: 'Ask Me Anything: 10 answers to your questions about coffee',
      date: '2d ago',
      commentCount: 9,
      shareCount: 5
    },
    {
      id: 2,
      title: "The worst advice we've ever heard about coffee",
      date: '4d ago',
      commentCount: 1,
      shareCount: 2
    }
  ]
});
</script>

<template>
  <TabGroup as="div" class="flex flex-col gap-3">
    <TabList as="ul" class="flex gap-3 overflow-x-auto">
      <Tab
        as="li"
        v-slot="{ selected }"
        v-for="category in Object.keys(categories)"
        :key="category"
      >
        <button
          type="button"
          class="p-1 border-black dark:border-white hover:border-b-2"
          :class="{ 'font-semibold border-b-2 !border-primary': selected }"
        >
          {{ category }}
        </button>
      </Tab>
    </TabList>

    <TabPanels as="template">
      <TabPanel v-for="(posts, idx) in Object.values(categories)" :key="idx">
        <ul class="flex flex-col gap-3">
          <li v-for="post in posts" :key="post.id">
            <h3 class="text-sm font-medium leading-5">
              {{ post.title }}
            </h3>

            <ul class="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
              <li>{{ post.date }}</li>
              <li>&middot;</li>
              <li>{{ post.commentCount }} comments</li>
              <li>&middot;</li>
              <li>{{ post.shareCount }} shares</li>
            </ul>
          </li>
        </ul>
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>
