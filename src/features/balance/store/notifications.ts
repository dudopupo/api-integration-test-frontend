import { create } from 'zustand';

type Notification = {
  message: string;
  type: 'success' | 'error' | 'info';
};

type NotificationStore = {
  notification: Notification | null;
  showNotification: (message: string, type: Notification['type']) => void;
  clearNotification: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notification: null,
  showNotification: (message, type) => set({ notification: { message, type } }),
  clearNotification: () => set({ notification: null })
}));