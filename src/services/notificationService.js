import { mockNotifications } from '@/data/mock';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let notifications = [...mockNotifications];

export const notificationService = {
  async getNotifications(userId) {
    await delay(300);
    return notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getUnreadCount(userId) {
    await delay(200);
    return notifications.filter(n => n.userId === userId && !n.read).length;
  },

  async markAsRead(id) {
    await delay(200);
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index] = { ...notifications[index], read: true };
    }
    return { success: true };
  },

  async markAllAsRead(userId) {
    await delay(300);
    notifications = notifications.map(n => 
      n.userId === userId ? { ...n, read: true } : n
    );
    return { success: true };
  },

  async deleteNotification(id) {
    await delay(300);
    notifications = notifications.filter(n => n.id !== id);
    return { success: true };
  }
};
