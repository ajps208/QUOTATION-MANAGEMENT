'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, Card, CardContent, Link, Stack, TextField, Typography } from '@mui/material';
import { LockOpen as LockOpenIcon } from '@mui/icons-material';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { ROUTES, USER_ROLES } from '@/constants/roles';

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuthStore();
  const [email, setEmail] = useState('business@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(user.role === USER_ROLES.BUSINESS ? ROUTES.BUSINESS.DASHBOARD : ROUTES.CUSTOMER.DASHBOARD);
    }
  }, [user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const currentUser = await authService.login(email, password);
      login(currentUser);
      if (currentUser.role === USER_ROLES.BUSINESS) {
        router.push(ROUTES.BUSINESS.DASHBOARD);
      } else if (currentUser.role === USER_ROLES.CUSTOMER) {
        router.push(ROUTES.CUSTOMER.DASHBOARD);
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setError(err.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
      <Card sx={{ width: '100%', maxWidth: 460, p: 1 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockOpenIcon color="primary" />
              <Typography variant="h5" fontWeight={700}>Sign in to Quotely</Typography>
            </Box>
            <Typography color="text.secondary">Access your quotation workspace with mock authentication enabled.</Typography>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <form onSubmit={handleSubmit} suppressHydrationWarning>
              <Stack spacing={3} sx={{ mt: 2 }} suppressHydrationWarning>
                <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 2 }}>
                  {loading ? 'Signing in...' : 'Login'}
                </Button>
              </Stack>
            </form>
            <Typography variant="body2" color="text.secondary">
              New here? <Link href="/register">Create an account</Link>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Demo credentials: business@example.com / customer@example.com / admin@example.com with password 123456? Actually use password123.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
