'use client';
import { useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, ListItemIcon, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleIcon from '@mui/icons-material/Circle';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    handleClose();
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 320,
            maxHeight: 400,
            overflow: 'auto',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        
        {notifications.length === 0 ? (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </Box>
        ) : (
          notifications.map((notif) => (
            <MenuItem 
              key={notif.id} 
              onClick={() => handleNotificationClick(notif)}
              sx={{ 
                py: 1.5, 
                px: 2, 
                whiteSpace: 'normal',
                backgroundColor: notif.read ? 'transparent' : 'action.hover'
              }}
            >
              <ListItemIcon sx={{ minWidth: 28, mt: 0.5, alignSelf: 'flex-start' }}>
                {!notif.read ? <CircleIcon color="primary" sx={{ fontSize: 10 }} /> : null}
              </ListItemIcon>
              <Box>
                <Typography variant="body2" fontWeight={notif.read ? 400 : 600}>
                  {notif.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {notif.message}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
