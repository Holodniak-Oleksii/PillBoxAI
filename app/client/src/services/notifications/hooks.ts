import { notificationService } from "@/services/notifications";
import { EQueryKey } from "@/shared/types/enums";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = () => {
  return useQuery({
    queryKey: [EQueryKey.NOTIFICATIONS],
    queryFn: () => notificationService.getNotifications(),
  });
};
