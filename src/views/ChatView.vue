<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <!-- En-tête -->
      <div
        class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <ButtonElement @click="goBack" secondary class="flex items-center gap-1 px-3 py-1.5">
          <span class="material-icons text-sm">arrow_back</span>
          Retour
        </ButtonElement>

        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Chat du signalement - {{ description }}
        </h1>
      </div>

      <!-- Zone de chat -->
      <div id="chat-container" class="h-[calc(100vh-300px)] overflow-y-auto p-4">
        <div v-if="loading" class="flex justify-center items-center h-full">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <template v-else>
          <div
            v-if="messages.length === 0"
            class="text-center text-gray-500 dark:text-gray-400 py-8"
          >
            <span class="material-icons text-4xl mb-2">chat</span>
            <p>Aucun message dans ce chat.</p>
            <p class="text-sm">Soyez le premier à écrire !</p>
          </div>

          <div
            v-for="(message, index) in messages"
            :key="index"
            class="mb-4"
            :class="{ 'text-right': message.userId === authStore.user?.id }"
          >
            <div
              class="inline-block max-w-[70%] rounded-lg px-4 py-2"
              :class="[
                message.userId === authStore.user?.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              ]"
            >
              <div class="font-medium text-sm">{{ message.sender }}</div>
              <div class="break-words">{{ message.text }}</div>
              <div class="text-xs mt-1 opacity-75">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </template>
      </div>

      <!-- Zone de saisie -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex gap-2">
          <input
            v-model="newMessage"
            type="text"
            class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Votre message..."
            @keyup.enter="sendMessage"
          />
          <ButtonElement @click="sendMessage" primary class="px-6">
            <span class="material-icons">send</span>
          </ButtonElement>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ButtonElement from '@/components/elements/ButtonElement.vue';
import { toast } from 'vue3-toastify';
import chatService from '@/services/chatService';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const messages = ref<any[]>([]);
const newMessage = ref('');
const loading = ref(true);

const description = ref(
  (window.history.state?.description as string) || 'Description non disponible'
);

const goBack = () => {
  console.log('Retour vers /signalements');
  router.push('/signalements');
};

const checkAndGetId = () => {
  console.log('Route params:', route.params);
  const id = route.params.id;
  if (!id || typeof id !== 'string') {
    console.error('ID invalide:', id);
    return null;
  }
  return id;
};

const connectToChat = () => {
  const id = checkAndGetId();
  if (!id) return;

  messages.value = [];
  loading.value = true;

  const socket = chatService.initSocket();

  socket.off('connect');
  socket.off('chatHistory');
  socket.off('message');
  socket.off('connect_error');
  socket.off('error');
  socket.off('disconnect');

  if (socket.connected) {
    console.log('Socket déjà connecté, rejoindre directement le signalement');
    socket.emit('joinSignalement', { signalementId: parseInt(id) });
  }

  socket.on('connect', () => {
    console.log('Connecté au serveur WebSocket');
    socket.emit('joinSignalement', { signalementId: parseInt(id) });
  });

  socket.on('chatHistory', (history: any[]) => {
    console.log('Historique reçu:', history);
    if (Array.isArray(history)) {
      messages.value = history.map((msg) => ({
        text: msg.message,
        sender: `${msg.name} ${msg.lastName}`,
        userId: msg.user_id,
        timestamp: msg.created_at
      }));
      loading.value = false;
      scrollToBottom();
    } else {
      console.error("Format d'historique invalide:", history);
      loading.value = false;
      toast.error('Erreur lors du chargement des messages');
    }
  });

  socket.on('message', (message: any) => {
    console.log('Nouveau message reçu:', message);
    if (message && message.text) {
      messages.value.push({
        text: message.text,
        sender: message.sender,
        userId: message.userId,
        timestamp: message.timestamp
      });
      scrollToBottom();
    } else {
      console.error('Format de message invalide:', message);
    }
  });

  socket.on('connect_error', (error: any) => {
    console.error('Erreur de connexion WebSocket:', error);
    toast.error('Erreur de connexion au chat');
    loading.value = false;
  });

  socket.on('error', (error: any) => {
    console.error('Erreur WebSocket:', error);
    toast.error(error.message || 'Erreur lors de la communication avec le chat');
    loading.value = false;
  });

  socket.on('disconnect', () => {
    console.log('Déconnecté du serveur WebSocket');
    loading.value = false;
  });

  const timeoutId = setTimeout(() => {
    if (loading.value) {
      loading.value = false;
      toast.error('Impossible de charger les messages');
    }
  }, 10000);

  onUnmounted(() => {
    clearTimeout(timeoutId);
  });
};

const disconnectFromChat = () => {
  const id = checkAndGetId();
  if (id) {
    const socket = chatService.initSocket();
    socket.emit('leaveSignalement', parseInt(id));
  }
  chatService.disconnectSocket();
};

const sendMessage = () => {
  const id = checkAndGetId();
  if (!id || !newMessage.value.trim()) return;

  console.log('Envoi du message pour le signalement:', id);
  try {
    const socket = chatService.initSocket();
    socket.emit('message', {
      signalementId: parseInt(id),
      text: newMessage.value.trim()
    });
    newMessage.value = '';
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    toast.error("Erreur lors de l'envoi du message");
  }
};

const scrollToBottom = () => {
  setTimeout(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, 100);
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  console.log("Composant monté, vérification de l'ID...");
  const id = checkAndGetId();
  if (id) {
    connectToChat();
  }
});

onUnmounted(() => {
  console.log('Démontage du composant...');
  disconnectFromChat();
});

watch(
  () => route.params.id,
  (newId) => {
    console.log('ID de route changé:', newId);
    if (newId) {
      disconnectFromChat();
      connectToChat();
    }
  }
);
</script>

<style scoped>
#chat-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

#chat-container::-webkit-scrollbar {
  width: 6px;
}

#chat-container::-webkit-scrollbar-track {
  background: transparent;
}

#chat-container::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>
