import { USER_MOCK } from "@/_mocks/user";
import { IUser } from "@/shared/types/entities";

export const userService = {
  getCurrentUser: async (): Promise<IUser> => {
    return USER_MOCK;
  },
};
