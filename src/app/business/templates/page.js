'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip, Badge, Stack, Skeleton, IconButton, Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaletteIcon from '@mui/icons-material/Palette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';

import PageHeader from '@/components/common/PageHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { businessService } from '@/services/businessService';
import { templateService } from '@/services/templateService';
import { quotationSettingsService } from '@/services/quotationSettingsService';
import { useSnackbar } from '@/hooks/useSnackbar';
import QuotationDocument from '@/components/quotation/QuotationDocument';
import LoadingState from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

// Static sample data for template preview (no real data needed for visual preview)
const SAMPLE_QUOTATION = {
  quotationNumber: 'PREVIEW-001',
  quotationDate: new Date().toISOString(),
  expiryDate: new Date(Date.now() + 30 * 86400000).toISOString(),
  items: [
    { name: 'Web Design Package', quantity: 1, unitPrice: 45000, discountType: 'NONE', discountValue: 0, taxPercent: 18 },
    { name: 'SEO Optimization', quantity: 3, unitPrice: 8000, discountType: 'NONE', discountValue: 0, taxPercent: 18 },
  ],
  overallDiscount: { type: 'NONE', value: 0 },
  specialDiscounts: [],
  additionalCharges: [],
  paymentTerms: '50% advance, balance on delivery',
  terms: 'Valid for 30 days.',
  customerNotes: 'Looking forward to working with you.',
  businessNotes: '',
};
const SAMPLE_CUSTOMER = {
  name: 'Rohan Mehta',
  companyName: 'TechVision Pvt Ltd',
  email: 'rohan@techvision.example.com',
  phone: '+91 9876543210',
  billingAddress: '12, Business Hub, Andheri East, Mumbai - 400069',
};

// A4 = 794px wide. We scale it to fit a 360px preview box
const PREVIEW_WIDTH = 360;
const A4_WIDTH = 794;
const PREVIEW_SCALE = PREVIEW_WIDTH / A4_WIDTH;
const PREVIEW_HEIGHT = Math.round(480 * PREVIEW_SCALE); // roughly A4 proportion


export default function TemplatesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  const [templates, setTemplates] = useState([]);
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  const [business, setBusiness] = useState(null);
  const [currentSettings, setCurrentSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.businessId) return;
    setLoading(true);
    setError(null);
    try {
      const [biz, tmpls, settings] = await Promise.all([
        businessService.getBusinessById(user.businessId),
        templateService.getTemplates(),
        quotationSettingsService.getSettingsByBusiness(user.businessId),
      ]);
      setBusiness(biz);
      setCurrentSettings(settings);
      setActiveTemplateId(settings.templateId || tmpls[0]?.id);
      setTemplates(tmpls);
    } catch (err) {
      setError(err);
      showError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [user?.businessId, showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetDefault = async (template) => {
    try {
      const merged = {
        ...currentSettings,
        templateId: template.id,
        primaryColor: template.primaryColor,
        headerLayout: template.headerLayout,
        showDiscounts: template.showDiscounts,
        showTax: template.showTax,
        showBusinessInfo: template.showBusinessInfo,
        showCustomerInfo: template.showCustomerInfo,
      };
      await quotationSettingsService.updateSettings(user.businessId, merged);
      setActiveTemplateId(template.id);
      setCurrentSettings(merged);
      showSuccess(`"${template.name}" set as your default template`);
    } catch (err) {
      showError('Failed to update template');
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [biz, tmpls, settings] = await Promise.all([
        businessService.getBusinessById(user.businessId),
        templateService.getTemplates(),
        quotationSettingsService.getSettingsByBusiness(user.businessId),
      ]);
      setBusiness(biz);
      setCurrentSettings(settings);
      setActiveTemplateId(settings.templateId || tmpls[0]?.id);
      setTemplates(tmpls);
    } catch (err) {
      setError(err);
      showError('Failed to refresh templates');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading && templates.length === 0) {
    return (
      <Box>
        <PageHeader
          title="Quotation Templates"
          subtitle="Choose how your quotations look when sent to customers or exported to PDF."
          actionLabel="Customize Design"
          actionIcon={<PaletteIcon />}
          onAction={() => router.push('/business/quotation-settings')}
        />
        <LoadingState variant="page" title="Loading Templates" description="Fetching your quotation templates..." />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <PageHeader
            title="Quotation Templates"
            subtitle="Choose how your quotations look when sent to customers or exported to PDF."
            actionLabel="Customize Design"
            actionIcon={<PaletteIcon />}
            onAction={() => router.push('/business/quotation-settings')}
          />
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh} disabled={loading} size="small" sx={{ color: loading ? 'text.disabled' : 'text.secondary' }}>
            <RefreshIcon fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {error && !loading && (
        <ErrorState
          error={error}
          onRetry={handleRefresh}
          variant="card"
          size="md"
          retryLabel="Retry"
        />
      )}

      {templates.length === 0 ? (
        <EmptyState
          type="templates"
          variant="page"
          size="md"
          actionLabel="Customize Design"
          onAction={() => router.push('/business/quotation-settings')}
        />
      ) : (
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {templates.map(template => {
            const isActive = template.id === activeTemplateId;
            // Merge template defaults with business's current settings for preview
            const previewSettings = {
              ...currentSettings,
              primaryColor: template.primaryColor,
              accentColor: currentSettings?.accentColor || '#0ea5e9',
              headerLayout: template.headerLayout,
              showDiscounts: template.showDiscounts,
              showTax: template.showTax,
              showBusinessInfo: template.showBusinessInfo,
              showCustomerInfo: template.showCustomerInfo,
              tableStyle: 'striped',
            };

            return (
              <Grid xs={12} sm={6} lg={4} key={template.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 1,
                    border: isActive ? '2px solid' : '1px solid',
                    borderColor: isActive ? 'primary.main' : 'divider',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px -12px rgba(0,0,0,0.12)',
                    },
                  }}
                >
{isActive && (
                    <Box sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'background.paper', borderRadius: '50%', zIndex: 1, boxShadow: 1 }}>
                      <CheckCircleIcon color="primary" sx={{ fontSize: 28 }} />
                    </Box>
                  )}
                  
                  <Box
                    sx={{
                      height: PREVIEW_HEIGHT,
                      overflow: 'hidden',
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      position: 'relative',
                      bgcolor: '#f8fafc',
                      cursor: 'pointer',
                    }}
                    onClick={() => !isActive && handleSetDefault(template)}
                  >
                    {/* Overlay to prevent interaction inside preview */}
                    <Box sx={{ position: 'absolute', inset: 0, zIndex: 2 }} />
                    <Box sx={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
                      {business && (
                        <QuotationDocument
                          business={business}
                          customer={SAMPLE_CUSTOMER}
                          quotation={SAMPLE_QUOTATION}
                          settings={previewSettings}
                          scale={1}
                          printMode
                        />
                      )}
                    </Box>
                    {/* Hover overlay */}
                    <Box sx={{
                      position: 'absolute', inset: 0, zIndex: 3,
                      bgcolor: 'rgba(79,70,229,0)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      opacity: 0,
                      transition: 'all 0.2s',
                      '&:hover': { opacity: 1, bgcolor: 'rgba(79,70,229,0.08)' },
                    }}>
                      <Box sx={{ bgcolor: 'white', borderRadius: 1, px: 2, py: 1, boxShadow: 3 }}>
                        <Typography variant="body2" fontWeight={600} color="primary">Click to Select</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
                        {template.name}
                      </Typography>
                      {isActive && <Badge badgeContent="Active" color="success" variant="outlined" sx={{ fontSize: '0.75rem', fontWeight: 600 }} />}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {template.description || 'A clean, professional template for your quotations.'}
                    </Typography>
                    <Stack direction="row" spacing={1.5} sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Chip
                        label="Primary"
                        icon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: template.primaryColor }} />}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                      <Chip label={template.headerLayout} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                      <Chip label={template.showDiscounts ? 'Discounts' : 'No Discounts'} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                    <Button
                      fullWidth
                      variant={isActive ? 'outlined' : 'contained'}
                      onClick={() => handleSetDefault(template)}
                      disabled={loading}
                      startIcon={isActive ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : undefined}
                    >
                      {isActive ? 'Set as Default' : 'Use This Template'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PaletteIcon />}
                      onClick={() => router.push('/business/quotation-settings')}
                    >
                      Customize
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}