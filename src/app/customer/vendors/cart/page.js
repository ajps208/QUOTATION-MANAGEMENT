'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Card, CardContent, Grid, Button,
  IconButton, TextField, Divider, Alert, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';

import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { quotationRequestService } from '@/services/quotationRequestService';
import { businessService } from '@/services/businessService';
import { useSnackbar } from '@/hooks/useSnackbar';
import { formatCurrency } from '@/utils/formatters';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const cartStore = useCartStore();

  const [vendor, setVendor] = useState(null);
  const [generalNote, setGeneralNote] = useState(cartStore.generalNote || '');
  const [itemNotes, setItemNotes] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      if (!cartStore.businessId) return;
      try {
        const data = await businessService.getBusinessById(cartStore.businessId);
        setVendor(data);
      } catch (e) {
        showError('Could not load vendor info');
      }
    };
    fetchVendor();
  }, [cartStore.businessId]);

  const handleQuantityChange = (productId, val) => {
    const qty = Math.max(1, parseInt(val, 10) || 1);
    cartStore.updateQuantity(productId, qty);
  };

  const handleItemNoteChange = (productId, note) => {
    setItemNotes((prev) => ({ ...prev, [productId]: note }));
  };

  const handleRemove = (productId) => {
    cartStore.removeItem(productId);
  };

  const handleSubmit = async () => {
    if (!user?.id) return showError('You must be logged in');
    if (cartStore.items.length === 0) return showError('Your cart is empty');

    setSubmitting(true);
    try {
      const requestPayload = {
        customerId: user.id,
        businessId: cartStore.businessId,
        items: cartStore.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          notes: itemNotes[item.productId] || '',
        })),
        generalNote: generalNote,
      };

      const newRequest = await quotationRequestService.submitRequest(requestPayload);
      showSuccess('Quotation request submitted successfully!');
      cartStore.clearCart();
      router.push('/customer/requests');
    } catch (error) {
      showError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartStore.items.length === 0) {
    return (
      <Box>
        <PageHeader title="Request Cart" subtitle="Review your items before submitting" />
        <EmptyState
          title="Your cart is empty"
          description="Browse vendors and add products to your cart to request a quotation."
        />
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="contained" onClick={() => router.push('/customer/vendors')}>
            Browse Vendors
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <IconButton onClick={() => router.back()} sx={{ bgcolor: 'background.paper' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Request Cart</Typography>
          <Typography variant="body2" color="text.secondary">
            {vendor ? `Requesting from ${vendor.name}` : 'Loading vendor…'}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* Cart Items */}
        <Grid xs={12} md={8}>
          <Card sx={{ borderRadius: 1 }}>
            <CardContent sx={{ p: 0 }}>
              {cartStore.items.map((item, index) => (
                <Box key={item.productId}>
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1, pr: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Unit Price: {formatCurrency(item.unitPrice)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                          label="Qty"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                          size="small"
                          sx={{ width: 90 }}
                          slotProps={{ input: { min: 1 } }}
                        />
                        <IconButton color="error" onClick={() => handleRemove(item.productId)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <TextField
                      label="Notes for this item (optional)"
                      value={itemNotes[item.productId] || ''}
                      onChange={(e) => handleItemNoteChange(item.productId, e.target.value)}
                      size="small"
                      fullWidth
                      placeholder="e.g., specific requirements, specifications..."
                    />
                  </Box>
                  {index < cartStore.items.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Summary & Submit */}
        <Grid xs={12} md={4}>
          <Card sx={{ borderRadius: 1, position: 'sticky', top: 80 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Request Summary</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Items</Typography>
                <Typography variant="body2" fontWeight={600}>{cartStore.items.length}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2" color="text.secondary">Total Qty</Typography>
                <Typography variant="body2" fontWeight={600}>{cartStore.getTotalItems()}</Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Alert severity="info" sx={{ mb: 3, borderRadius: 1 }}>
                The business will review your request and send back a formal quotation with pricing.
              </Alert>

              <TextField
                label="General Note to Vendor"
                value={generalNote}
                onChange={(e) => {
                  setGeneralNote(e.target.value);
                  cartStore.setGeneralNote(e.target.value);
                }}
                multiline
                rows={4}
                fullWidth
                placeholder="Describe your requirements, budget expectations, timeline, etc."
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<SendIcon />}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
