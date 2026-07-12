'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { PersonAddAlt as PersonAddAltIcon } from '@mui/icons-material';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { ROUTES, USER_ROLES } from '@/constants/roles';

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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
      <Card sx={{ width: '100%', maxWidth: 560, p: 1 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAddAltIcon color="primary" />
              <Typography variant="h5" fontWeight={700}>Create your account</Typography>
            </Box>
            <Typography color="text.secondary">Set up a business or customer workspace for your quotation flow.</Typography>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <form onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField label="Full name" name="name" value={form.name} onChange={handleChange} required />
                <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
                <TextField label="Company" name="company" value={form.company} onChange={handleChange} required />
                <TextField select label="Role" name="role" value={form.role} onChange={handleChange}>
                  <MenuItem value={USER_ROLES.CUSTOMER}>Customer</MenuItem>
                  <MenuItem value={USER_ROLES.BUSINESS}>Business</MenuItem>
                </TextField>
                <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 2 }}>
                  {loading ? 'Creating account...' : 'Register'}
                </Button>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
