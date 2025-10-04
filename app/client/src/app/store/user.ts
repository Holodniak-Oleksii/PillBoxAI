import { IUser } from "@/shared/types/entities";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUserStore {
  user: IUser | null;
  isAuth: boolean;
  refreshToken: null | string;
  accessToken: null | string;

  setUser: (user: IUser) => void;
  logout: () => void;
  setCredentials: (refreshToken: string, accessToken: string) => void;
  removeCredentials: () => void;
}

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      accessToken: null,
      refreshToken: null,

      setUser: (user) => set({ user, isAuth: true }),
      logout: () => set({ user: null, isAuth: false }),
      setCredentials: (refreshToken, accessToken) =>
        set({ accessToken, refreshToken }),
      removeCredentials: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "pillbox",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
