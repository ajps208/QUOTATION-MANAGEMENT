'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES, USER_ROLES } from '@/constants/roles';
import LoadingState from '@/components/common/LoadingState';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      const fallback = user.role === USER_ROLES.BUSINESS ? ROUTES.BUSINESS.DASHBOARD : ROUTES.CUSTOMER.DASHBOARD;
      router.replace(fallback);
    }
  }, [mounted, isAuthenticated, user, allowedRoles, router]);

  if (!mounted) {
    return <LoadingState title="Authenticating your workspace..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return null;
  }

  return children;
}
