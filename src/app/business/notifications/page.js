'use client';
import { useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, List, ListItem, Divider, Avatar } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { formatDate } from '@/utils/formatters';

export default function BusinessNotificationsPage() {
  const { user } = useAuthStore();
  const { notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
    }
  }, [user]);

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on your quotation requests and customer activity"
        actionLabel="Mark all as read"
        actionIcon={<DoneAllIcon />}
        onAction={() => markAllAsRead(user.id)}
      />

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="When customers interact with your business, you'll be notified here."
        />
      ) : (
        <Card sx={{ borderRadius: 1 }}>
          <List disablePadding>
            {notifications.map((notification, index) => {
              const isUnread = !notification.read;
              return (
                <Box key={notification.id}>
                  <ListItem
                    sx={{
                      py: 3,
                      px: 3,
                      bgcolor: isUnread ? 'primary.50' : 'transparent',
                      transition: 'background-color 0.3s',
                      alignItems: 'flex-start',
                    }}
                    secondaryAction={
                      isUnread && (
                        <IconButton edge="end" onClick={() => markAsRead(notification.id)} color="primary" title="Mark as read">
                          <CheckIcon />
                        </IconButton>
                      )
                    }
                  >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
                      <Avatar sx={{ bgcolor: isUnread ? 'primary.main' : 'grey.300', color: isUnread ? 'white' : 'grey.600', flexShrink: 0 }}>
                        <NotificationsIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1, pr: 4 }}>
                        <Typography variant="body1" fontWeight={isUnread ? 600 : 400} mb={0.5}>
                          {notification.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(notification.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </Box>
              );
            })}
          </List>
        </Card>
      )}
    </Box>
  );
}
