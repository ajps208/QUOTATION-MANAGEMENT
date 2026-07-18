'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Toolbar } from '@mui/material';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { USER_ROLES } from '@/constants/roles';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

const drawerWidth = 260;

export default function BusinessLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== USER_ROLES.BUSINESS) {
      router.push('/login');
    } else {
      fetchNotifications(user.id);
    }
  }, [isAuthenticated, user, router, fetchNotifications]);

  if (!isAuthenticated || user?.role !== USER_ROLES.BUSINESS) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Topbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2.5, md: 4, xl: 5 },
          pt: { xs: 2.5, md: 3 },
          pb: { xs: 4, md: 6 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#F6F6F6',
          overflowX: 'hidden',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }} />
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
