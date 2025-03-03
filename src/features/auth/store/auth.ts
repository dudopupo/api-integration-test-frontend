import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import Cookies from "js-cookie";

type AuthState = {
  userId: number | null;
  userName: string | null;
  isLogin: boolean;
  login: (userId: number | null, userName: string | null, isLogin: boolean) => void;
  logout: () => void;
};

type AuthCookieData = Omit<AuthState, 'login' | 'logout'>;

export const cookieStorage: PersistStorage<AuthCookieData> = {
  getItem: async (name: string) => {
    try {
      const value = Cookies.get(name);
      return value ? { state: JSON.parse(value) } : null;
    } catch (error) {
      console.log("Failed to get cookie:", error);
      return null;
    }
  },
  setItem: (name, value) => {
    Cookies.set(name, JSON.stringify(value.state), { expires: 7 });
  },
  removeItem: (name: string) => {
    try {
      Cookies.remove(name);
    } catch (error) {
      console.log("Failed to remove cookie:", error);
    }
  },
};


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      userName: null,
      isLogin: false,
      login: (userId: number | null, userName: string | null, isLogin: boolean): void => {
        set({ userId, userName, isLogin });
      },
      logout: (): void => {
        set({ 
          userId: null, 
          userName: null, 
          isLogin: false 
        });

        Cookies.remove("auth-storage");
    }
    }),
    {
      name: "auth-storage", 
      storage: cookieStorage,
      partialize: (state: AuthState): AuthCookieData => ({
        userId: state.userId,
        userName: state.userName,
        isLogin: state.isLogin,
      })
    }
  )
);
