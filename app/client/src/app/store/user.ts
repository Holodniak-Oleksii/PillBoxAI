import { IUser } from "@/shared/types/entities";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUserStore {
  user: IUser | null;
  isAuth: boolean;
  accessToken: null | string;

  setUser: (user: IUser) => void;
  logout: () => void;
  setCredentials: (accessToken: string) => void;
  removeCredentials: () => void;
}

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      accessToken: null,

      setUser: (user) => set({ user, isAuth: true }),
      logout: () =>
        set({
          user: null,
          isAuth: false,
          accessToken: null,
        }),
      setCredentials: (accessToken) => set({ accessToken, isAuth: true }),
      removeCredentials: () => set({ accessToken: null, isAuth: false }),
    }),
    {
      name: "pillbox",
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    }
  )
);
