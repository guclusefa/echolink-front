import { defineStore } from "pinia";

interface NotificationState {
  count: number;
  latest: any[];
}

export const useNotificationStore = defineStore("notifications", {
  state: (): NotificationState => ({
    count: 0,
    latest: [],
  }),
  actions: {
    addNotification(signalement: any) {
      this.count++;
      this.latest.unshift(signalement);

      if (this.latest.length > 10) {
        this.latest.pop();
      }
    },
    resetCount() {
      this.count = 0;
    },
  },
});
