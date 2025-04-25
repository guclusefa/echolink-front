import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore(
  'notifications',
  () => {
    const count = ref(0);
    const latest = ref<any[]>([]);

    function addNotification(signalement: any) {
      const exists = latest.value.some((n) => n.id === signalement.id);

      if (!exists) {
        count.value++;
        latest.value.unshift({
          ...signalement,
          isRead: false
        });
        if (latest.value.length > 10) latest.value.pop();
      }
    }

    function resetCount() {
      count.value = 0;
    }

    function markAsRead(id: number) {
      const index = latest.value.findIndex((n) => n.id === id);
      if (index !== -1 && !latest.value[index].isRead) {
        latest.value[index] = {
          ...latest.value[index],
          isRead: true
        };
        count.value = Math.max(count.value - 1, 0);
      }
    }

    function markAllAsRead() {
      latest.value = latest.value.map(notif => ({
        ...notif,
        isRead: true
      }));
      count.value = 0;
    }    

    return {
      count,
      latest,
      addNotification,
      resetCount,
      markAsRead,
      markAllAsRead
    };
  },
  {
    persist: {
      key: 'notif-store',
      storage: localStorage
    }
  }
);
