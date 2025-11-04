import { NOTIFICATIONS_MOCK } from "@/_mocks/notifications";
import { INotification } from "@/shared/types/entities";

export const notificationService = {
  getNotifications: async (): Promise<INotification[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return NOTIFICATIONS_MOCK;
  },
};
