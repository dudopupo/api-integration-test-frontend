
import { AxiosInstance } from 'axios';
import { useAuthStore } from '@/features/auth/store';

export const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const { userId, userName, signature } = useAuthStore.getState();
    
    if (userName && userId && signature) {     
      config.headers.set('user-id', userId);
      config.headers.set('x-signature', signature);
    }
    
    return config;
  });
};