'use client';
import { useState, useEffect, useRef } from 'react';
import { Box, Grid, Typography, Avatar, InputAdornment, Divider } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { useAuthStore } from '@/store/useAuthStore';
import { businessService } from '@/services/businessService';
import PageHeader from '@/components/common/PageHeader';
import FormSection from '@/components/common/FormSection';
import FormField from '@/components/common/FormField';
import AppButton from '@/components/common/AppButton';
import { useSnackbar } from '@/hooks/useSnackbar';

const MAX_LOGO_SIZE = 3 * 1024 * 1024;

export default function BusinessSettingsPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const logoInputRef = useRef(null);
  
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
  const [logo, setLogo] = useState(null);
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
        setLogo(biz.logo || null);
      } catch (err) {
        showError('Failed to load business profile');
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [user]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_LOGO_SIZE) {
      showError('Logo must be smaller than 3MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      showError('Only image files are allowed');
      return;
    }
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      await businessService.updateBusiness(user.businessId, { logo: dataUrl });
      setLogo(dataUrl);
      showSuccess('Logo uploaded successfully');
    } catch (err) {
      showError('Failed to upload logo');
    }
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <Typography color="text.secondary">Loading settings...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="Business Settings" 
        subtitle="Manage your company profile and default preferences"
      />

      <Grid container spacing={{ xs: 3, md: 4 }}>
        {/* Sidebar Card */}
        <Grid xs={12} md={4}>
          <FormSection>
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Avatar
                src={logo || undefined}
                sx={{
                  width: 96,
                  height: 96,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  fontSize: '2.5rem',
                  boxShadow: '0 4px 12px rgba(79,70,229,0.15)',
                  objectFit: 'contain',
                }}
              >
                {!logo && <BusinessIcon sx={{ fontSize: 44 }} />}
              </Avatar>
              <Typography variant="h6" fontWeight={600} sx={{ letterSpacing: '-0.01em' }}>
                {formData.name || 'Your Business'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {formData.industry || 'Industry not set'}
              </Typography>
              <AppButton
                variant="outlined"
                size="small"
                startIcon={<UploadFileIcon />}
                sx={{ mt: 2.5 }}
                onClick={() => logoInputRef.current?.click()}
              >
                {logo ? 'Change Logo' : 'Upload Logo'}
              </AppButton>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                hidden
                onChange={handleLogoUpload}
              />
            </Box>
          </FormSection>
          
          <Box sx={{ mt: 3 }}>
            <FormSection title="Quotation Defaults" description="Default values for new quotations">
              <FormField
                label="Default Tax Rate"
                type="number"
                value={formData.taxPercent}
                onChange={(e) => setFormData({...formData, taxPercent: Number(e.target.value)})}
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
              />
              <FormField
                label="Currency"
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
                placeholder="INR"
              />
              <FormField
                label="Quotation ID Prefix"
                value={formData.quotationPrefix}
                onChange={(e) => setFormData({...formData, quotationPrefix: e.target.value})}
                placeholder="QT"
                helperText="e.g. QT, INV, EST"
              />
            </FormSection>
          </Box>
        </Grid>
        
        {/* Main Form */}
        <Grid xs={12} md={8}>
          <FormSection title="Company Profile">
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid xs={12} sm={6}>
                  <FormField
                    label="Business Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Acme Corporation"
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormField
                    label="Industry / Type"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    placeholder="Technology, Manufacturing..."
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormField
                    label="Contact Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    placeholder="hello@acme.com"
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormField
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </Grid>
                <Grid xs={12}>
                  <FormField
                    label="Street Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="123 Business Park, Sector 5"
                  />
                </Grid>
                <Grid xs={12} sm={4}>
                  <FormField
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Mumbai"
                  />
                </Grid>
                <Grid xs={12} sm={4}>
                  <FormField
                    label="State / Province"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="Maharashtra"
                  />
                </Grid>
                <Grid xs={12} sm={4}>
                  <FormField
                    label="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="India"
                  />
                </Grid>

                <Grid xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid xs={12}>
                  <FormField
                    label="Default Payment Terms"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                    multiline
                    rows={2}
                    placeholder="e.g., 50% advance, balance on delivery"
                    helperText="Automatically added to new quotations"
                  />
                </Grid>
                <Grid xs={12}>
                  <FormField
                    label="Business Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    multiline
                    rows={3}
                    placeholder="Tell customers about your business..."
                    helperText="Visible to customers on your vendor profile"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 4, mt: 1 }}>
                <AppButton
                  type="submit"
                  variant="contained"
                  loading={saving}
                  size="large"
                  startIcon={!saving && <SaveIcon />}
                  sx={{ minWidth: 160 }}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </AppButton>
              </Box>
            </Box>
          </FormSection>
        </Grid>
      </Grid>
    </Box>
  );
}
