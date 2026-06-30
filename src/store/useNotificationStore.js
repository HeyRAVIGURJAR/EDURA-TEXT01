import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newNotif = {
      id,
      message: notification.message || '',
      type: notification.type || 'info', // 'info' | 'success' | 'warning' | 'error' | 'broadcast'
      timestamp: Date.now(),
      read: false,
      autoDismiss: notification.autoDismiss !== false,
    };

    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));

    // Auto-dismiss after 5 seconds
    if (newNotif.autoDismiss) {
      setTimeout(() => {
        get().dismissNotification(id);
      }, 5000);
    }

    return id;
  },

  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => set({ notifications: [] }),

  // Broadcast a notification (from admin)
  broadcast: (message) => {
    return get().addNotification({
      message,
      type: 'broadcast',
      autoDismiss: false,
    });
  },
}));
