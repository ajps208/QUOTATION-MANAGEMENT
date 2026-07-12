'use client';
import { useState, useEffect } from 'react';
import { Box, Button, TextField, Grid } from '@mui/material';
import AppDialog from '@/components/common/AppDialog';

export default function CustomerDialog({ open, onClose, onSave, customer }) {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    alternativePhone: '',
    taxNumber: '',
    billingAddress: '',
    shippingAddress: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        companyName: customer.companyName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        alternativePhone: customer.alternativePhone || '',
        taxNumber: customer.taxNumber || '',
        billingAddress: customer.billingAddress || '',
        shippingAddress: customer.shippingAddress || '',
        city: customer.city || '',
        state: customer.state || '',
        country: customer.country || 'India',
        postalCode: customer.postalCode || '',
        notes: customer.notes || '',
      });
    } else {
      setFormData({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        alternativePhone: '',
        taxNumber: '',
        billingAddress: '',
        shippingAddress: '',
        city: '',
        state: '',
        country: 'India',
        postalCode: '',
        notes: '',
      });
    }
  }, [customer, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  const actions = (
    <>
      <Button onClick={onClose} disabled={loading} color="inherit">Cancel</Button>
      <Button onClick={handleSubmit} disabled={loading || !formData.name || !formData.email} variant="contained">
        {loading ? 'Saving...' : 'Save Customer'}
      </Button>
    </>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={customer ? 'Edit Customer' : 'Add Customer'}
      actions={actions}
      maxWidth="md"
    >
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <TextField label="Contact Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required fullWidth autoFocus />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField label="Company Name" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} fullWidth />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required fullWidth />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} fullWidth />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField label="Tax Number (GST/VAT)" value={formData.taxNumber} onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })} fullWidth />
          </Grid>
          
          <Grid xs={12}>
            <TextField label="Billing Address" value={formData.billingAddress} onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })} multiline rows={2} fullWidth />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} fullWidth />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} fullWidth />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField label="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} fullWidth />
          </Grid>

          <Grid xs={12}>
            <TextField label="Private Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} multiline rows={3} fullWidth helperText="Only visible to your business" />
          </Grid>
        </Grid>
      </Box>
    </AppDialog>
  );
}
