'use client';
import { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Button, TextField } from '@mui/material';
import AppDialog from '@/components/common/AppDialog';
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
      maxWidth="sm"
    >
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Box sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {activeStep === 0 && (
          <>
            <TextField 
              label="Business Name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              fullWidth 
            />
            <TextField 
              label="Business Type (e.g. B2B, B2C)" 
              value={formData.type} 
              onChange={(e) => setFormData({...formData, type: e.target.value})} 
              fullWidth 
            />
          </>
        )}
        
        {activeStep === 1 && (
          <>
            <TextField 
              label="Default Tax Percentage (%)" 
              type="number"
              value={formData.taxPercent} 
              onChange={(e) => setFormData({...formData, taxPercent: Number(e.target.value)})} 
              fullWidth 
            />
            <TextField 
              label="Default Currency (e.g. INR, USD)" 
              value={formData.currency} 
              onChange={(e) => setFormData({...formData, currency: e.target.value})} 
              fullWidth 
            />
          </>
        )}
        
        {activeStep === 2 && (
          <>
            <TextField 
              label="Quotation Prefix (e.g. QT, INV)" 
              value={formData.quotationPrefix} 
              onChange={(e) => setFormData({...formData, quotationPrefix: e.target.value})} 
              fullWidth 
              helperText="Quotations will look like: QT-2025-001"
            />
            <Typography variant="body2" color="text.secondary" mt={2}>
              You can change all these settings later from the Settings dashboard.
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
        <Button disabled={activeStep === 0 || loading} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext} disabled={loading}>
          {activeStep === steps.length - 1 ? (loading ? 'Saving...' : 'Complete Setup') : 'Next'}
        </Button>
      </Box>
    </AppDialog>
  );
}
