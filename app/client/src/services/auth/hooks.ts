import { useUserStore } from "@/app/store/user";
import { ILoginRequest, IRegisterRequest } from "@/shared/types/entities";
import { EQueryKey } from "@/shared/types/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./index";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);
  return useMutation({
    mutationFn: async (credentials: ILoginRequest) =>
      await authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData([EQueryKey.PROFILE], data.user);
      setUser(data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);
  return useMutation({
    mutationFn: async (registerData: IRegisterRequest) =>
      await authService.register(registerData),
    onSuccess: (data) => {
      queryClient.setQueryData([EQueryKey.PROFILE], data.user);
      setUser(data.user);
    },
  });
};

export const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);
  return useMutation({
    mutationFn: async () => await authService.googleAuth(),
    onSuccess: (data) => {
      queryClient.setQueryData([EQueryKey.PROFILE], data.user);
      setUser(data.user);
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
