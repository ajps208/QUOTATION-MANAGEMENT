'use client';
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Grid, Avatar } from '@mui/material';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import PageHeader from '@/components/common/PageHeader';
import { useSnackbar } from '@/hooks/useSnackbar';

export default function CustomerProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(user.id, formData);
      updateUser(updatedUser);
      showSuccess('Profile updated successfully');
    } catch (error) {
      showError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Box>
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your personal and company information"
      />

      <Grid container spacing={4}>
        <Grid xs={12} md={4}>
          <Card sx={{ borderRadius: 3, textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <Avatar 
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '2.5rem' }}
              >
                {user.avatar || 'U'}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>{user.email}</Typography>
              <Typography variant="body2">{user.bio}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} mb={3}>Edit Profile</Typography>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <TextField 
                      label="Full Name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      required 
                      fullWidth 
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField 
                      label="Email Address" 
                      type="email" 
                      value={formData.email} 
                      disabled // Email usually can't be changed easily
                      fullWidth 
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField 
                      label="Phone Number" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                      fullWidth 
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField 
                      label="Company Name" 
                      value={formData.company} 
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })} 
                      fullWidth 
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField 
                      label="Bio / Description" 
                      value={formData.bio} 
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
                      multiline 
                      rows={4} 
                      fullWidth 
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" disabled={loading} size="large">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
