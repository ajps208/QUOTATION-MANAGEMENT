'use client';
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Avatar } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import PageHeader from '@/components/common/PageHeader';
import FormSection from '@/components/common/FormSection';
import FormField from '@/components/common/FormField';
import AppButton from '@/components/common/AppButton';
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

      <Grid container spacing={{ xs: 3, md: 4 }}>
        <Grid xs={12} md={4}>
          <FormSection>
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(79,70,229,0.15)',
                }}
              >
                {user.avatar || user.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="h6" fontWeight={600} sx={{ letterSpacing: '-0.01em' }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, wordBreak: 'break-word' }}>
                {user.email}
              </Typography>
              {user.bio && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.6 }}>
                  {user.bio}
                </Typography>
              )}
            </Box>
          </FormSection>
        </Grid>
        
        <Grid xs={12} md={8}>
          <FormSection title="Edit Profile">
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid xs={12} sm={6}>
                  <FormField
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Your full name"
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormField
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    disabled
                    helperText="Contact support to change your email"
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormField
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormField
                    label="Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your company"
                  />
                </Grid>
                <Grid xs={12}>
                  <FormField
                    label="Bio / Description"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    multiline
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 4, mt: 1 }}>
                <AppButton
                  type="submit"
                  variant="contained"
                  loading={loading}
                  size="large"
                  startIcon={!loading && <SaveIcon />}
                  sx={{ minWidth: 160 }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </AppButton>
              </Box>
            </Box>
          </FormSection>
        </Grid>
      </Grid>
    </Box>
  );
}
