<template>
  <div class="channel-messages flex flex-col flex-1 h-full">
    <!-- En-tête du channel -->
    <div class="channel-header bg-gray-800 px-6 py-3 border-b border-gray-700 flex items-center">
      <div v-if="channel" class="flex items-center gap-3">
        <span class="text-gray-400 text-lg">#</span>
        <div>
          <h2 class="text-lg font-semibold text-white">{{ channel.name }}</h2>
          <p class="text-sm text-gray-400">Channel de discussion</p>
        </div>
      </div>
      <p v-else class="text-gray-400 text-sm">
        Sélectionnez un channel pour commencer à discuter
      </p>
    </div>

    <!-- Zone des messages -->
    <div class="messages-container flex-1 overflow-y-auto p-4 bg-gray-900">
      <div v-for="message in messages" :key="message.id" class="message mb-3 hover:bg-gray-800/50 rounded p-2 transition-colors">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm flex-shrink-0">
            {{ message.sender.charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <div class="flex items-baseline gap-2">
              <span class="font-medium text-white">{{ message.sender }}</span>
              <span class="text-xs text-gray-400">{{ formatDate(message.timestamp) }}</span>
            </div>
            <p class="text-gray-300 mt-0.5 break-words">{{ message.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone de saisie du message -->
    <div class="message-input bg-gray-800 px-4 py-3">
      <div class="flex gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Écrivez votre message..."
          class="flex-1 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          @keyup.enter="sendMessage"
          :disabled="!channel"
        />
        <button
          @click="sendMessage"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-2"
          :disabled="!channel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
          Envoyer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { io, Socket } from 'socket.io-client'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

interface Channel {
  id: string
  name: string
}

interface Message {
  id: string
  message: string
  sender: string
  timestamp: Date
  room_id: string
}

const props = defineProps<{
  channel: Channel | null
}>()

const messages = ref<Message[]>([])
const newMessage = ref('')
const socket = ref<Socket | null>(null)
const authStore = useAuthStore()

const connectSocket = () => {
  if (socket.value) return

  socket.value = io(import.meta.env.VITE_API_URL, {
    transports: ['websocket'],
    auth: {
      token: authStore.token
    }
  })

  socket.value.on('connect', () => {
    console.log('Connected to Socket.IO server')
    if (authStore.user?.id) {
      socket.value?.emit('setUser', authStore.user.id)
    }
  })

  socket.value.on('receiveMessage', (message) => {
    console.log('Message received:', message)
    if (message.room_id === props.channel?.id) {
      const formattedMessage = {
        id: message.id || Date.now().toString(),
        message: message.text,
        sender: message.sender,
        timestamp: new Date(),
        room_id: message.room_id
      }
      messages.value.push(formattedMessage)
      scrollToBottom()
    }
  })

  socket.value.on('connect_error', (error) => {
    console.error('Socket connection error:', error)
  })

  socket.value.on('error', (error) => {
    console.error('Socket error:', error)
  })
}

const loadMessages = async (channelId: string) => {
  try {
    const response = await api.get(`/chat/messages/${channelId}`)
    messages.value = response.data
    scrollToBottom()
  } catch (error) {
    console.error('Error loading messages:', error)
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !props.channel || !socket.value) return

  try {
    socket.value.emit('sendMessage', {
      roomId: props.channel.id,
      text: newMessage.value.trim()
    })

    const tempMessage = {
      id: Date.now().toString(),
      message: newMessage.value.trim(),
      sender: `${authStore.user.name} ${authStore.user.lastName}`,
      timestamp: new Date(),
      room_id: props.channel.id
    }

    messages.value.push(tempMessage)
    
    newMessage.value = ''
    
    scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

const scrollToBottom = () => {
  setTimeout(() => {
    const container = document.querySelector('.messages-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, 100)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

watch(() => props.channel, (newChannel) => {
  if (newChannel) {
    if (socket.value) {
      socket.value.emit('joinRoom', newChannel.id)
    }
    loadMessages(newChannel.id)
  }
})

onMounted(() => {
  connectSocket()
})
</script>

<style scoped>
.messages-container {
  scrollbar-width: thin;
  scrollbar-color: #4B5563 #1F2937;
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #1F2937;
}

.messages-container::-webkit-scrollbar-thumb {
  background-color: #4B5563;
  border-radius: 3px;
}

/* Animation des messages */
.message {
  transition: all 0.2s ease;
}

.message:hover {
  transform: translateX(2px);
}
</style> 