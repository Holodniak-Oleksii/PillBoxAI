import { USER_MOCK } from "@/_mocks/user";
import { IUser } from "@/shared/types/entities";

export const authService = {
  login: async (): Promise<IUser> => {
    return USER_MOCK;
  },

  register: async (): Promise<IUser> => {
    return USER_MOCK;
  },

  googleAuth: async (): Promise<IUser> => {
    return USER_MOCK;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("authToken");
  },
};
