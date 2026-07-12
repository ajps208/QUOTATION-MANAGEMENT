'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Toolbar } from '@mui/material';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { USER_ROLES } from '@/constants/roles';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

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
          px: { xs: 3, md: 5, xl: 6 },
          pt: { xs: 3, md: 4 },
          pb: { xs: 6, md: 8 },
          width: { sm: `calc(100% - 280px)` },
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for fixed Topbar */}
        <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
