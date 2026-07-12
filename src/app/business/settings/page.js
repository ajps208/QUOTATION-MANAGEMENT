'use client';
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, TextField, Button, Avatar } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';

import { useAuthStore } from '@/store/useAuthStore';
import { businessService } from '@/services/businessService';
import PageHeader from '@/components/common/PageHeader';
import { useSnackbar } from '@/hooks/useSnackbar';

export default function BusinessSettingsPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    taxPercent: 18,
    currency: 'INR',
    quotationPrefix: 'QT',
    paymentTerms: '',
    description: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!user?.businessId) return;
      try {
        const biz = await businessService.getBusinessById(user.businessId);
        setFormData({
          name: biz.name || '',
          industry: biz.industry || '',
          email: biz.email || '',
          phone: biz.phone || '',
          address: biz.address || '',
          city: biz.city || '',
          state: biz.state || '',
          country: biz.country || 'India',
          taxPercent: biz.taxPercent ?? 18,
          currency: biz.currency || 'INR',
          quotationPrefix: biz.quotationPrefix || 'QT',
          paymentTerms: biz.paymentTerms || '',
          description: biz.description || '',
        });
      } catch (err) {
        showError('Failed to load business profile');
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await businessService.updateBusiness(user.businessId, formData);
      showSuccess('Business settings updated successfully');
    } catch (err) {
      showError('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography sx={{ mt: 4 }}>Loading settings...</Typography>;

  return (
    <Box>
      <PageHeader 
        title="Business Settings" 
        subtitle="Manage your company profile and default preferences"
      />

      <Grid container spacing={4}>
        <Grid xs={12} md={4}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.light', color: 'primary.main' }}>
                <BusinessIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h6" fontWeight={700}>{formData.name}</Typography>
              <Typography variant="body2" color="text.secondary">{formData.industry}</Typography>
              <Button variant="outlined" size="small" sx={{ mt: 2 }}>Upload Logo</Button>
            </CardContent>
          </Card>
          
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={2}>QUOTATION DEFAULTS</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3,marginTop: 2 }}>
                <TextField 
                  label="Default Tax (%)" 
                  type="number" 
                  value={formData.taxPercent} 
                  onChange={(e) => setFormData({...formData, taxPercent: Number(e.target.value)})} 
                  size="small"
                />
                <TextField 
                  label="Currency" 
                  value={formData.currency} 
                  onChange={(e) => setFormData({...formData, currency: e.target.value})} 
                  size="small"
                />
                <TextField 
                  label="Quotation ID Prefix" 
                  value={formData.quotationPrefix} 
                  onChange={(e) => setFormData({...formData, quotationPrefix: e.target.value})} 
                  size="small"
                  helperText="e.g. QT, INV, EST"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} mb={3}>Company Profile</Typography>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 5, mt: 2 }}>
                <Grid container spacing={4}>
                  <Grid xs={12} sm={6}>
                    <TextField label="Business Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required fullWidth />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField label="Industry / Type" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} fullWidth />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField label="Contact Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required fullWidth />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField label="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} fullWidth />
                  </Grid>
                  <Grid xs={12}>
                    <TextField label="Street Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} fullWidth />
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <TextField label="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} fullWidth />
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <TextField label="State / Province" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} fullWidth />
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <TextField label="Country" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} fullWidth />
                  </Grid>
                  <Grid xs={12}>
                    <TextField 
                      label="Default Payment Terms" 
                      value={formData.paymentTerms} 
                      onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})} 
                      multiline 
                      rows={2} 
                      fullWidth 
                      helperText="These will be automatically added to new quotations"
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField 
                      label="Business Description" 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      multiline 
                      rows={3} 
                      fullWidth 
                      helperText="Visible to customers on your vendor profile"
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 4 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={saving} 
                    size="large"
                    startIcon={<SaveIcon />}
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
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
