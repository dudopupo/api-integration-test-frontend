import { useEffect } from "react";
import { useAuthStore } from "../auth/store";
import { cookieStorage } from "../auth/store/auth";

export const useInitializeAuth = () => {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const initialState = await cookieStorage.getItem("auth-storage");
      if (initialState) {
        const { userId, userName, signature } = initialState.state;
        if (userId && userName && signature) {
            const isLogin = true
            login(userId, userName, signature, isLogin);
        } else {
            logout();
        }
      }
    };

    initializeAuth();
  }, [login, logout]);
};
