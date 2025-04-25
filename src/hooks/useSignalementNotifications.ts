import { onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";
import { useNotificationStore } from "@/stores/notifications";

const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
});

socket.on("connect", () => {
  console.log("Connecté au socket avec l'ID :", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Erreur de connexion socket :", err.message);
});

export function useSignalementNotifications(callback: (signalement: any) => void) {
  const notifStore = useNotificationStore();

  onMounted(() => {
    socket.on("newSignalement", (signalement) => {
      notifStore.addNotification(signalement);
      callback(signalement);
    });

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  });

  onUnmounted(() => {
    socket.off("newSignalement", callback);
  });
}
