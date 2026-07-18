'use client';
import { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import AppDialog from '@/components/common/AppDialog';
import FormField from '@/components/common/FormField';
import AppButton from '@/components/common/AppButton';
import { useAuthStore } from '@/store/useAuthStore';
import { businessService } from '@/services/businessService';

const steps = ['Business Details', 'Tax Information', 'Preferences'];

export default function BusinessOnboarding({ open, onClose }) {
  const { user, updateUser } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.company || '',
    type: 'B2B',
    taxPercent: 18,
    currency: 'INR',
    quotationPrefix: 'QT',
  });

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      try {
        const business = await businessService.createBusiness({
          ...formData,
          ownerName: user.name,
          email: user.email,
        });
        updateUser({ businessId: business.id });
        onClose();
      } catch (error) {
        console.error("Failed to create business profile", error);
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <AppDialog
      open={open}
      title="Complete Your Business Profile"
      subtitle="Set up your business in a few quick steps"
      maxWidth="sm"
    >
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mt: 1 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '0.8125rem',
                    fontWeight: activeStep === steps.indexOf(label) ? 600 : 400,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Box sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {activeStep === 0 && (
          <>
            <FormField
              label="Business Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Acme Corporation"
              autoFocus
            />
            <FormField
              label="Business Type"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              placeholder="B2B, B2C, etc."
              helperText="How would you describe your business model?"
            />
          </>
        )}
        
        {activeStep === 1 && (
          <>
            <FormField
              label="Default Tax Percentage"
              type="number"
              value={formData.taxPercent}
              onChange={(e) => setFormData({...formData, taxPercent: Number(e.target.value)})}
              helperText="Applied to new items by default"
            />
            <FormField
              label="Default Currency"
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
              placeholder="INR, USD, EUR..."
            />
          </>
        )}
        
        {activeStep === 2 && (
          <>
            <FormField
              label="Quotation Prefix"
              value={formData.quotationPrefix}
              onChange={(e) => setFormData({...formData, quotationPrefix: e.target.value})}
              placeholder="QT"
              helperText={`Quotations will look like: ${formData.quotationPrefix}-2025-001`}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
              You can change all these settings later from the Settings dashboard.
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, mt: 4, pt: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <AppButton
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
          variant="text"
          color="secondary"
        >
          Back
        </AppButton>
        <AppButton
          variant="contained"
          onClick={handleNext}
          loading={loading}
          sx={{ minWidth: 140 }}
        >
          {activeStep === steps.length - 1 ? (loading ? 'Saving...' : 'Complete Setup') : 'Next'}
        </AppButton>
      </Box>
    </AppDialog>
  );
}
