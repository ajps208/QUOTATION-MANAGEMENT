'use client';
import { AppBar, Toolbar, IconButton, Box, Avatar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import NotificationBell from './NotificationBell';

const drawerWidth = 260;

export default function Topbar() {
  const { user } = useAuthStore();
  const { toggleSidebar } = useAppStore();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        borderBottom: '1px solid #ECECEC',
        bgcolor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(16px)',
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, md: 64 }, px: { xs: 2, md: 3 } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{
            mr: 1.5,
            display: { md: 'none' },
            color: 'text.secondary',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <NotificationBell />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              pl: 1.5,
              borderLeft: '1px solid #ECECEC',
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
              <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3, fontSize: '0.8125rem' }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6875rem' }}>
                {user?.company || user?.role}
              </Typography>
            </Box>
            <Avatar
              sx={{
                bgcolor: '#1F6B47',
                width: 36,
                height: 36,
                fontSize: '0.8125rem',
                fontWeight: 600,
                boxShadow: '0 2px 6px rgba(31,107,71,0.2)',
              }}
            >
              {user?.avatar || 'U'}
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
