'use client';
import { useState, useEffect } from 'react';
import { Box, Button, Grid } from '@mui/material';
import AppDialog from '@/components/common/AppDialog';
import FormField from '@/components/common/FormField';
import FormGrid from '@/components/common/FormGrid';

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
      <Button onClick={onClose} disabled={loading} color="inherit" sx={{ borderRadius: 1 }}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={loading || !formData.name || !formData.email}
        variant="contained"
        sx={{ borderRadius: 1, minWidth: 140 }}
      >
        {loading ? 'Saving...' : 'Save Customer'}
      </Button>
    </>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={customer ? 'Edit Customer' : 'Add New Customer'}
      subtitle={customer ? 'Update customer details' : 'Add a new customer to your database'}
      actions={actions}
      maxWidth="md"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <FormGrid spacing={2.5}>
          <FormField xs={12} sm={6} label="Contact Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required autoFocus placeholder="John Doe" />
          <FormField xs={12} sm={6} label="Company Name" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} placeholder="Acme Inc." />
          <FormField xs={12} sm={6} label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="john@acme.com" />
          <FormField xs={12} sm={6} label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
          <FormField xs={12} sm={6} label="Tax Number (GST/VAT)" value={formData.taxNumber} onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })} placeholder="22AAAAA0000A1Z5" />
          
          <FormField xs={12} label="Billing Address" value={formData.billingAddress} onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })} multiline rows={2} placeholder="Full billing address..." />
          <FormField xs={12} sm={4} label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Mumbai" />
          <FormField xs={12} sm={4} label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="Maharashtra" />
          <FormField xs={12} sm={4} label="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} placeholder="400001" />

          <FormField xs={12} label="Private Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} multiline rows={3} helperText="Only visible to your business" placeholder="Internal notes about this customer..." />
        </FormGrid>
      </Box>
    </AppDialog>
  );
}
