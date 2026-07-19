export const notificationService = {
  async getNotifications(userId) {
    const res = await fetch(`/api/notifications?userId=${userId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch notifications');
    return data;
  },

  async markAsRead(notificationId) {
    const res = await fetch(`/api/notifications/${notificationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to mark as read');
    return data;
  },

  async markAllAsRead(userId) {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true, userId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to mark all as read');
    return data;
  },

  async getUnreadCount(userId) {
    const res = await fetch(`/api/notifications?userId=${userId}&count=true`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch unread count');
    return data.unreadCount || 0;
  },
};
