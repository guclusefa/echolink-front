import { io } from "socket.io-client";
import { useNotificationStore } from "@/stores/notifications";

export const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    token: localStorage.getItem("token") || "",
  },
  transports: ["websocket"],
});

export function initSocket() {
  const notifStore = useNotificationStore();

  socket.on("connect", () => {
    console.log("🟢 CONNECTÉ au WebSocket :", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Erreur de connexion WebSocket :", err.message);
  });

  socket.on("newSignalement", (signalement) => {
    console.log("📥 Nouveau signalement reçu :", signalement);
    notifStore.addNotification(signalement);

    if (Notification.permission === "granted") {
      new Notification("🆘 Nouveau signalement", {
        body: signalement.title,
        icon: "/icon.png",
      });
    }
  });
}
