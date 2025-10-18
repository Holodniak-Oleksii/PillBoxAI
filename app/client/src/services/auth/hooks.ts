import { useUserStore } from "@/app/store/user";
import { EQueryKey } from "@/shared/types/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./index";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);
  return useMutation({
    mutationFn: async () => await authService.login(),
    onSuccess: (data) => {
      queryClient.setQueryData([EQueryKey.PROFILE], data);
      setUser(data);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);
  return useMutation({
    mutationFn: async () => await authService.register(),
    onSuccess: (data) => {
      queryClient.setQueryData([EQueryKey.PROFILE], data);
      setUser(data);
    },
  });
};

export const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);
  return useMutation({
    mutationFn: async () => await authService.googleAuth(),
    onSuccess: (data) => {
      queryClient.setQueryData([EQueryKey.PROFILE], data);
      setUser(data);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
