import axios from "axios";
import { io } from "socket.io-client";
import { useAuthStore } from "@/stores/auth";

const getAuthToken = () => {
  const authStore = useAuthStore();
  return authStore.token;
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Créer une nouvelle connexion socket
const createSocket = () => {
  console.log('Création d\'un nouveau socket');
  const token = getAuthToken();
  if (!token) {
    console.error('Pas de token disponible pour le socket');
    throw new Error('Authentication required');
  }

  const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket']
  });

  // Ajouter des listeners de debug
  socket.on('connect', () => {
    console.log('Socket connecté avec ID:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket déconnecté, raison:', reason);
  });

  socket.on('error', (error) => {
    console.error('Erreur socket:', error);
  });

  return socket;
};

let socket: any = null;

// Initialiser ou réinitialiser le socket
export const initSocket = () => {
  console.log('Initialisation du socket. Socket existant:', !!socket);
  if (!socket) {
    socket = createSocket();
  } else {
    console.log('État actuel du socket:', {
      connected: socket.connected,
      disconnected: socket.disconnected,
      id: socket.id
    });
  }
  return socket;
};

// Déconnecter le socket
export const disconnectSocket = () => {
  console.log('Déconnexion du socket');
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// 📌 Récupérer les salons disponibles
export const getChatRooms = async (): Promise<{ id: number; name: string }[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/chat/rooms`,
    getAuthHeaders()
  );
  return response.data;
};

// 📌 Créer un nouveau salon
export const createChatRoom = async (name: string) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/chat/rooms`,
    { name },
    getAuthHeaders()
  );
  return response.data;
};

// 📌 Récupérer l'historique des messages d'un salon
export const getRoomMessages = async (roomId: number) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/chat/messages/${roomId}`,
    getAuthHeaders()
  );
  return response.data;
};

// 📌 Associer un utilisateur à un socket
export const setUser = (userId: number) => {
  if (!socket) socket = initSocket();
  socket.emit("setUser", userId);
};

// 📌 Rejoindre un salon
export const joinRoom = (roomId: number) => {
  if (!socket) socket = initSocket();
  socket.emit("joinRoom", roomId);
};

// 📌 Rejoindre un signalement
export const joinSignalement = (signalementId: number) => {
  if (!socket) socket = initSocket();
  console.log('Rejoindre le signalement:', signalementId);
  socket.emit('joinSignalement', { signalementId });
};

// 📌 Quitter un signalement
export const leaveSignalement = (signalementId: number) => {
  if (!socket) return;
  console.log('Quitter le signalement:', signalementId);
  socket.emit('leaveSignalement', signalementId);
};

// 📌 Demander l'historique des messages
export const getMessages = (signalementId: number) => {
  if (!socket) socket = initSocket();
  console.log('Demande de l\'historique des messages pour le signalement:', signalementId);
  socket.emit('getMessages', { signalementId });
};

// 📌 Envoyer un message
export const sendMessage = (signalementId: number, text: string) => {
  if (!socket) socket = initSocket();
  console.log('Envoi d\'un message au signalement:', signalementId, 'Texte:', text);
  socket.emit('message', { signalementId, text });
};

// 📌 Écouter les nouveaux messages reçus
export const onMessageReceived = (callback: (message: { sender: string; text: string }) => void) => {
  if (!socket) socket = initSocket();
  socket.on("receiveMessage", callback);
};

// 📌 Écouter les notifications de connexion
export const onNotification = (callback: (message: string) => void) => {
  if (!socket) socket = initSocket();
  socket.on("notification", callback);
};

export default {
  initSocket,
  disconnectSocket,
  joinSignalement,
  leaveSignalement,
  getMessages,
  sendMessage,
  getChatRooms,
  createChatRoom,
  getRoomMessages,
  setUser,
  joinRoom,
  onMessageReceived,
  onNotification
};
