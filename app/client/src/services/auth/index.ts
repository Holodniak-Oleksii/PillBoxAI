import { useUserStore } from "@/app/store/user";
import { API } from "@/services";
import {
  IAuthResponse,
  ILoginRequest,
  IRegisterRequest,
} from "@/shared/types/entities";

export const authService = {
  login: async (credentials: ILoginRequest): Promise<IAuthResponse> => {
    const response = await API.post<IAuthResponse>("/auth/login", credentials);

    if (response.data.token) {
      useUserStore.getState().setCredentials(response.data.token);
    }

    return response.data;
  },

  register: async (data: IRegisterRequest): Promise<IAuthResponse> => {
    const response = await API.post<IAuthResponse>("/auth/register", data);

    if (response.data.token) {
      useUserStore.getState().setCredentials(response.data.token);
    }

    return response.data;
  },

  googleAuth: async (): Promise<IAuthResponse> => {
    throw new Error("Google Auth not yet implemented on backend");
  },

  logout: async (): Promise<void> => {
    useUserStore.getState().removeCredentials();
  },
};
