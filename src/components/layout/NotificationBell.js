'use client';
import { useState, useCallback } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CircleIcon from '@mui/icons-material/Circle';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { notifications, unreadCount, markAsRead, fetchNotifications } = useNotificationStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
    if (notifications.length === 0 && user?.id) {
      fetchNotifications(user.id);
    }
  }, [notifications.length, user, fetchNotifications]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleNotificationClick = useCallback((notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    handleClose();
    if (notification.link) {
      router.push(notification.link);
    }
  }, [markAsRead, handleClose, router]);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          color: 'text.secondary',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.6rem',
              minWidth: 16,
              height: 16,
            },
          }}
        >
          <NotificationsNoneIcon sx={{ fontSize: 22 }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 340,
            maxHeight: 420,
            overflow: 'auto',
            mt: 1.5,
            border: '1px solid #ECECEC',
            borderRadius: 4,
            boxShadow: '0 10px 40px -8px rgba(0,0,0,0.1)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>
            Notifications
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#ECECEC' }} />

        {notifications.length === 0 ? (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <NotificationsNoneIcon sx={{ fontSize: 36, color: '#C8CCCA', mb: 1 }} />
            <Typography variant="body2" color="text.disabled">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          notifications.slice(0, 20).map((notif) => (
            <MenuItem
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              sx={{
                py: 1.5,
                px: 2,
                whiteSpace: 'normal',
                bgcolor: notif.read ? 'transparent' : 'rgba(31,107,71,0.04)',
                '&:hover': { bgcolor: notif.read ? '#F6F6F6' : 'rgba(31,107,71,0.08)' },
                mx: 0.5,
                borderRadius: 3,
                mb: '2px',
              }}
            >
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                {!notif.read && (
                  <Box sx={{ mt: 0.5, flexShrink: 0 }}>
                    <CircleIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                  </Box>
                )}
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={notif.read ? 400 : 600}
                    sx={{ fontSize: '0.8125rem', lineHeight: 1.4 }}
                  >
                    {notif.title}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                    {notif.message}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
