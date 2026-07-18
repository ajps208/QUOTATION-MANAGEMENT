'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Typography, Stack, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import BusinessIcon from '@mui/icons-material/BusinessOutlined';
import LockIcon from '@mui/icons-material/LockOutlined';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { ROUTES, USER_ROLES } from '@/constants/roles';
import FormField from '@/components/common/FormField';
import AppButton from '@/components/common/AppButton';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    role: USER_ROLES.CUSTOMER,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const newUser = await authService.register(form);
      login(newUser);
      router.push(form.role === USER_ROLES.BUSINESS ? ROUTES.BUSINESS.DASHBOARD : ROUTES.CUSTOMER.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Unable to register');
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
          maxWidth: 460,
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
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            Get started with Quotely for your business
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
            <Stack spacing={2.25} suppressHydrationWarning>
              <FormField
                label="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ fontSize: 20, color: '#A2A8A4' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <FormField
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
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
                label="Phone number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ fontSize: 20, color: '#A2A8A4' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <FormField
                label="Company name"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
                placeholder="Acme Inc."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ fontSize: 20, color: '#A2A8A4' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <FormField
                select
                label="I am a"
                name="role"
                value={form.role}
                onChange={handleChange}
                options={[
                  { value: USER_ROLES.CUSTOMER, label: 'Customer' },
                  { value: USER_ROLES.BUSINESS, label: 'Business' },
                ]}
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ fontSize: 20, color: '#A2A8A4' }} />
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
                {loading ? 'Creating account...' : 'Create account'}
              </AppButton>
            </Stack>
          </form>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3.5, textAlign: 'center', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Typography
            component="a"
            href="/login"
            variant="body2"
            fontWeight={600}
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Sign in
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}
