'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip, Badge
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaletteIcon from '@mui/icons-material/Palette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';

import PageHeader from '@/components/common/PageHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { businessService } from '@/services/businessService';
import { templateService } from '@/services/templateService';
import { quotationSettingsService } from '@/services/quotationSettingsService';
import { useSnackbar } from '@/hooks/useSnackbar';
import QuotationDocument from '@/components/quotation/QuotationDocument';
import { mockQuotations } from '@/data/mock';
import { mockCustomers } from '@/data/mock';

// A4 = 794px wide. We scale it to fit a 360px preview box
const PREVIEW_WIDTH = 360;
const A4_WIDTH = 794;
const PREVIEW_SCALE = PREVIEW_WIDTH / A4_WIDTH;
const PREVIEW_HEIGHT = Math.round(480 * PREVIEW_SCALE); // roughly A4 proportion

// Sample data for template preview
const SAMPLE_QUOTATION = {
  ...mockQuotations[0],
  quotationNumber: 'PREVIEW-001',
};
const SAMPLE_CUSTOMER = mockCustomers[0];

export default function TemplatesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  const [templates, setTemplates] = useState([]);
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  const [business, setBusiness] = useState(null);
  const [currentSettings, setCurrentSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.businessId) return;
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
        showError('Failed to load templates');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSetDefault = async (template) => {
    try {
      const merged = { ...currentSettings, templateId: template.id, primaryColor: template.primaryColor, headerLayout: template.headerLayout };
      await quotationSettingsService.saveSettings(user.businessId, merged);
      setActiveTemplateId(template.id);
      setCurrentSettings(merged);
      showSuccess(`"${template.name}" set as your default template`);
    } catch (err) {
      showError('Failed to update template');
    }
  };

  if (loading) return <Typography sx={{ mt: 4 }}>Loading templates...</Typography>;

  return (
    <Box>
      <PageHeader
        title="Quotation Templates"
        subtitle="Choose how your quotations look when sent to customers or exported to PDF."
        actionLabel="Customize Design"
        actionIcon={<PaletteIcon />}
        onAction={() => router.push('/business/quotation-settings')}
      />

      <Grid container spacing={4}>
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
                  borderRadius: 3,
                  border: isActive ? '2px solid' : '1px solid',
                  borderColor: isActive ? 'primary.main' : 'divider',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px -12px rgba(0,0,0,0.12)',
                  },
                }}
              >
                {isActive && (
                  <Box sx={{ position: 'absolute', top: -14, right: -14, bgcolor: 'background.paper', borderRadius: '50%', zIndex: 1 }}>
                    <CheckCircleIcon color="primary" sx={{ fontSize: 36 }} />
                  </Box>
                )}

                {/* Live QuotationDocument Preview */}
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
                    <Box sx={{ bgcolor: 'white', borderRadius: 2, px: 2, py: 1, boxShadow: 3 }}>
                      <Typography variant="body2" fontWeight={600} color="primary">Click to Select</Typography>
                    </Box>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" fontWeight={700}>{template.name}</Typography>
                    {isActive && <Chip label="Active" size="small" color="primary" />}
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {template.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={template.headerLayout} size="small" variant="outlined" />
                    {template.showDiscounts && <Chip label="Discounts" size="small" variant="outlined" />}
                    {template.showTax && <Chip label="Tax" size="small" variant="outlined" />}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                  <Button
                    variant={isActive ? 'outlined' : 'contained'}
                    onClick={() => handleSetDefault(template)}
                    disabled={isActive}
                    sx={{ flex: 1 }}
                  >
                    {isActive ? 'Current Default' : 'Use This Template'}
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
    </Box>
  );
}
