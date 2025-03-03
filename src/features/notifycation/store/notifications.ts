import { create } from 'zustand';

type NotificationType = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  show: boolean;
};

type Store = {
  notification: NotificationType;
  showNotification: (message: string, type: NotificationType['type']) => void;
  hideNotification: () => void;
};

export const useNotificationStore = create<Store>((set) => ({
  notification: { message: '', type: 'info', show: false },
  showNotification: (message, type) => 
    set({ notification: { message, type, show: true } }),
  hideNotification: () => 
    set((state) => ({ notification: { ...state.notification, show: false } })),
}));