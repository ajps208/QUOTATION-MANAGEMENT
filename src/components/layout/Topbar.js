'use client';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import NotificationBell from './NotificationBell';

const drawerWidth = 280;

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
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer - 1, // Stay under mobile drawer
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 2, md: 4 } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NotificationBell />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.company || user?.role}
              </Typography>
            </Box>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main',
                width: 40, 
                height: 40,
                fontSize: '1rem',
                fontWeight: 600
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
