'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Typography, Stack, InputAdornment, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import LockIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { ROUTES, USER_ROLES } from '@/constants/roles';
import FormField from '@/components/common/FormField';
import AppButton from '@/components/common/AppButton';

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuthStore();
  const [email, setEmail] = useState('business@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F6F6F6',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-40%',
          right: '-20%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(31,107,71,0.05) 0%, transparent 70%)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(104,174,142,0.04) 0%, transparent 70%)',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              background: '#1F6B47',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.375rem',
              mx: 'auto',
              mb: 2.5,
              boxShadow: '0 4px 16px rgba(31,107,71,0.25)',
            }}
          >
            Q
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.025em',
              mb: 0.75,
              fontSize: '1.5rem',
            }}
          >
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            Sign in to your Quotely workspace
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 4,
            border: '1px solid #ECECEC',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
            p: { xs: 3, sm: 4 },
          }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 3,
                fontSize: '0.875rem',
                border: '1px solid #F5BFBF',
                backgroundColor: '#FDE2E2',
                color: '#8C2020',
                '& .MuiAlert-icon': { color: '#E57373' },
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} suppressHydrationWarning>
            <Stack spacing={2.5} suppressHydrationWarning>
              <FormField
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ fontSize: 20, color: '#A2A8A4' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <FormField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ fontSize: 20, color: '#A2A8A4' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#A2A8A4' }}
                        >
                          {showPassword ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <AppButton
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                loading={loading}
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  borderRadius: 3,
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </AppButton>
            </Stack>
          </form>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3.5, textAlign: 'center', fontSize: '0.875rem' }}>
          New here?{' '}
          <Typography
            component="a"
            href="/register"
            variant="body2"
            fontWeight={600}
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Create an account
          </Typography>
        </Typography>

        <Box
          sx={{
            mt: 2.5,
            p: 2,
            bgcolor: 'rgba(31,107,71,0.03)',
            borderRadius: 3,
            border: '1px solid rgba(31,107,71,0.08)',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.6 }}>
            <strong>Demo:</strong> business@example.com / customer@example.com with password123
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
