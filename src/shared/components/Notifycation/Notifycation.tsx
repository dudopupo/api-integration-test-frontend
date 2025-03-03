'use client'
import { Snackbar, Alert } from '@mui/material';
import { useNotificationStore } from '@/features/notifycation/store';

export const Notification = () => {
  const { notification, hideNotification } = useNotificationStore();
  
  return (
    <Snackbar
      open={notification.show}
      autoHideDuration={6000}
      onClose={hideNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={hideNotification}
        severity={notification.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};