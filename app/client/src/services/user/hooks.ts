import { useUserStore } from "@/app/store/user";
import { userService } from "@/services/user";
import { EQueryKey } from "@/shared/types/enums";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useQuery({
    queryKey: [EQueryKey.PROFILE],
    queryFn: async () => {
      const user = await userService.getCurrentUser();
      if (user) {
        setUser(user);
        return user;
      }
      return null;
    },
  });
};
