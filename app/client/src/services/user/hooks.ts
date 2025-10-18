import { userService } from "@/services/user";
import { EQueryKey } from "@/shared/types/enums";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: [EQueryKey.PROFILE],
    queryFn: () => userService.getCurrentUser(),
  });
};
