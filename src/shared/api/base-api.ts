import axios, { AxiosError, AxiosInstance,  AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import CryptoJS from 'crypto-js';
import { useAuthStore } from '@/features/auth/store/auth';
import { useNotificationStore } from '@/features/notifycation/store';

export const createSignature = (body: unknown, secretKey: string): string => {
  const payload = body ? JSON.stringify(body) : '{}';
  return CryptoJS.HmacSHA512(payload, secretKey).toString(CryptoJS.enc.Hex);
};

export class BaseApi {
  axiosInstance: AxiosInstance;

  constructor(baseURL: string, secretKey: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });

    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      let { userId } = useAuthStore.getState();
      console.log(userId);
      

      if (!userId) {
        userId = config.data?.userId;
      }
      

      if (config.data) {
        const signature = createSignature(config.data, secretKey);
        
        config.headers['user-id'] = userId;
        config.headers['x-signature'] = signature;
      }

      return config;
    }, (error) => {
      return Promise.reject(error);
    });


    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.log(error)
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError) {
    const { showNotification } = useNotificationStore.getState();
    if (error.response) {
      const { logout } = useAuthStore.getState();
      const { status, data } = error.response;
      const message = data?.error || 'Произошла ошибка';
      showNotification(message, 'error');
      switch (status) {
        case 401:
          console.log('Unauthorized: Access is denied due to invalid credentials.');
          logout();
          break;
        case 403:
          console.log('Forbidden: You do not have permission to access this resource.');
          break;
        case 404:
          console.log('Not Found: The requested resource could not be found.');
          break;
        case 429:
          console.log('Too Many Requests: You have exceeded the rate limit.');
          break;
        case 500:
          console.log('Internal Server Error: An error occurred on the server.');
          break;
        default:
          console.log('An unexpected error occurred:', error);
      }
    } else {
      showNotification('Ошибка сети', 'error');
    }
  }
}

export const API = new BaseApi(process.env.NEXT_PUBLIC_API_URL || '', process.env.NEXT_PUBLIC_SECRET_KEY || '');