'use client';

import { useEffect, useState, useMemo } from 'react';
import { Box, Card, Typography, IconButton, List, ListItem, Divider, Avatar, MenuItem, Select, Stack, Paper, Skeleton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ListSkeleton } from '@/components/common/SkeletonLoaders';
import { formatDate } from '@/utils/formatters';
import { useRouter } from 'next/navigation';
import { Tooltip, IconButton as MuiIconButton } from '@mui/material';

export default function BusinessNotificationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      await fetchNotifications(user.id);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    if (filter === 'read') return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, filter]);

  const handleRefresh = () => {
    fetchData();
  };

  if (!user) return null;

  if (loading && notifications.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <PageHeader
          title="Notifications"
          subtitle="Stay updated on your quotation requests and customer activity"
        />
        <ListSkeleton count={5} variant="notification" />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on your quotation requests and customer activity"
        actionLabel="Mark all as read"
        actionIcon={<DoneAllIcon />}
        onAction={() => markAllAsRead(user.id)}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        {notifications.length > 0 && (
          <Select
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ minWidth: 120, fontSize: '0.8125rem' }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="read">Read</MenuItem>
          </Select>
        )}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <MuiIconButton onClick={handleRefresh} disabled={loading} size="small" sx={{ color: loading ? 'text.disabled' : 'text.secondary' }}>
              <RefreshIcon fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </MuiIconButton>
          </Tooltip>
        </Box>
      </Stack>

      {error && !loading && (
        <ErrorState
          error={error}
          onRetry={handleRefresh}
          variant="alert"
          size="md"
          retryLabel="Retry"
        />
      )}

      {filteredNotifications.length === 0 ? (
        <EmptyState
          type={filter === 'all' ? 'notifications' : 'general'}
          variant="page"
          size="md"
          title={filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
          description={filter === 'all' ? "When customers interact with your business, you'll be notified here." : `You have no ${filter} notifications.`}
        />
      ) : (
        <Card sx={{ borderRadius: 1 }}>
          <List disablePadding>
            {filteredNotifications.map((notification, index) => {
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
                      cursor: notification.link ? 'pointer' : 'default',
                      '&:hover': { bgcolor: isUnread ? 'primary.100' : '#f8fafc' },
                    }}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id);
                      if (notification.link) router.push(notification.link);
                    }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {isUnread && (
                          <IconButton edge="end" onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }} color="primary" title="Mark as read" size="small">
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton edge="end" onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }} color="error" title="Delete" size="small">
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
                      <Avatar sx={{ bgcolor: isUnread ? 'primary.main' : 'grey.300', color: isUnread ? 'white' : 'grey.600', flexShrink: 0 }}>
                        <NotificationsIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1, pr: 8 }}>
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
                  {index < filteredNotifications.length - 1 && <Divider />}
                </Box>
              );
            })}
          </List>
        </Card>
      )}
    </Box>
  );
}