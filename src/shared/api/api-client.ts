import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/auth'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

apiClient.interceptors.request.use((config) => {
  const { userId, userName, signature } = useAuthStore.getState();

  if (signature && userId && userName) {   
    config.headers.set('user-id', userId);
    config.headers.set('x-signature', signature);
  } else {
    return config;
  }

  return config;
});

