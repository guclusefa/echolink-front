<template>
  <div class="channels-view flex">
    <ChannelList @channel-selected="selectChannel" />
    <ChannelMessages :channel="selectedChannel" class="flex-1" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChannelList from '@/components/ChannelList.vue'
import ChannelMessages from '@/components/ChannelMessages.vue'

interface Channel {
  id: string
  name: string
}

const selectedChannel = ref<Channel | null>(null)

const selectChannel = (channel: Channel) => {
  selectedChannel.value = channel
}
</script>

<style scoped>
.channels-view {
  height: 100vh;
  overflow: hidden;
}
</style> 