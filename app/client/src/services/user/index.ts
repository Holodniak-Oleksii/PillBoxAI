import { API } from "@/services";
import { IUser } from "@/shared/types/entities";

export const userService = {
  getUserById: async (id: number): Promise<IUser> => {
    const response = await API.get<IUser>(`/auth/user/${id}`);
    return response.data;
  },

  getUserByUsername: async (username: string): Promise<IUser> => {
    const response = await API.get<IUser>(`/auth/user/username/${username}`);
    return response.data;
  },

  getCurrentUser: async (): Promise<IUser> => {
    throw new Error(
      "getCurrentUser needs implementation - use getUserById or getUserByUsername"
    );
  },
};
