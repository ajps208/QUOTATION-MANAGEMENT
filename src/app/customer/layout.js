'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Toolbar } from '@mui/material';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { USER_ROLES } from '@/constants/roles';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function CustomerLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== USER_ROLES.CUSTOMER) {
      router.push('/login');
    } else {
      fetchNotifications(user.id);
    }
  }, [isAuthenticated, user, router, fetchNotifications]);

  if (!isAuthenticated || user?.role !== USER_ROLES.CUSTOMER) {
    return null; // Will redirect
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Topbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 6 },
          width: { sm: `calc(100% - 280px)` },
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for fixed Topbar */}
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
