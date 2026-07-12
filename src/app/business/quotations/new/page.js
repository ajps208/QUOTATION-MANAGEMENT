'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box, Grid, Card, CardContent, Typography, Button, TextField,
  MenuItem, Select, FormControl, InputLabel, Divider, Accordion,
  AccordionSummary, AccordionDetails, InputAdornment, IconButton,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useAuthStore } from '@/store/useAuthStore';
import { customerService } from '@/services/customerService';
import { productService } from '@/services/productService';
import { businessService } from '@/services/businessService';
import { quotationRequestService } from '@/services/quotationRequestService';
import { quotationService } from '@/services/quotationService';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';
import { DISCOUNT_TYPE } from '@/constants/discountTypes';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { useSnackbar } from '@/hooks/useSnackbar';
import LineItemRow from '../components/LineItemRow';
import DiscountRow from '../components/DiscountRow';
import ChargeRow from '../components/ChargeRow';
import QuotationTotals from '../components/QuotationTotals';
import QuotationDocument from '@/components/quotation/QuotationDocument';
import PageHeader from '@/components/common/PageHeader';
import { formatDate } from '@/utils/formatters';
import { quotationSettingsService } from '@/services/quotationSettingsService';

const emptyItem = () => ({
  productId: '',
  name: '',
  quantity: 1,
  unitPrice: 0,
  discountType: DISCOUNT_TYPE.NONE,
  discountValue: 0,
  taxPercent: 18,
  unit: 'Item',
});

function QuotationBuilderInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId');

  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  const [business, setBusiness] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [sourceRequest, setSourceRequest] = useState(null);

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [items, setItems] = useState([emptyItem()]);
  const [overallDiscount, setOverallDiscount] = useState({ type: DISCOUNT_TYPE.NONE, value: 0 });
  const [specialDiscounts, setSpecialDiscounts] = useState([]);
  const [additionalCharges, setAdditionalCharges] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState('');
  const [terms, setTerms] = useState('');
  const [businessNotes, setBusinessNotes] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Load initial data
  useEffect(() => {
    const init = async () => {
      if (!user?.businessId) return;
      try {
        const [biz, custs, prods, sets] = await Promise.all([
          businessService.getBusinessById(user.businessId),
          customerService.getCustomers(user.businessId),
          productService.getProducts(user.businessId),
          quotationSettingsService.getSettingsByBusiness(user.businessId),
        ]);
        setBusiness(biz);
        setCustomers(custs);
        setProducts(prods);
        setSettings(sets);

        // Pre-fill from request if requestId is given
        if (requestId) {
          const req = await quotationRequestService.getRequestById(requestId);
          setSourceRequest(req);
          setCustomerId(req.customerId);
          setCustomerNotes(req.generalNote || '');

          const prefilledItems = req.items.map((ri) => {
            const prod = prods.find(p => p.id === ri.productId);
            return {
              productId: ri.productId,
              name: ri.name,
              quantity: ri.quantity,
              unitPrice: prod?.basePrice || 0,
              taxPercent: prod?.taxPercent || 18,
              unit: prod?.unit || 'Item',
              discountType: DISCOUNT_TYPE.NONE,
              discountValue: 0,
            };
          });
          setItems(prefilledItems.length > 0 ? prefilledItems : [emptyItem()]);
          setPaymentTerms(biz.paymentTerms || '');
        }
      } catch (err) {
        showError('Failed to load data for quotation builder');
      }
    };
    init();
  }, [user, requestId]);

  // Live calculation
  const totals = useMemo(() => {
    return calculateQuotationTotals({ items, overallDiscount, specialDiscounts, additionalCharges });
  }, [items, overallDiscount, specialDiscounts, additionalCharges]);

  const handleItemUpdate = (index, updatedItem) => {
    setItems(prev => prev.map((item, i) => i === index ? updatedItem : item));
  };
  const handleItemRemove = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };
  const handleAddItem = () => setItems(prev => [...prev, emptyItem()]);

  const handleSpecialDiscountUpdate = (index, updated) => {
    setSpecialDiscounts(prev => prev.map((d, i) => i === index ? updated : d));
  };
  const handleSpecialDiscountRemove = (index) => {
    setSpecialDiscounts(prev => prev.filter((_, i) => i !== index));
  };

  const handleChargeUpdate = (index, updated) => {
    setAdditionalCharges(prev => prev.map((c, i) => i === index ? updated : c));
  };
  const handleChargeRemove = (index) => {
    setAdditionalCharges(prev => prev.filter((_, i) => i !== index));
  };

  const buildPayload = (status) => ({
    businessId: user.businessId,
    customerId,
    requestId: requestId || null,
    quotationDate: new Date(quotationDate).toISOString(),
    expiryDate: new Date(expiryDate).toISOString(),
    items,
    overallDiscount,
    specialDiscounts,
    additionalCharges,
    paymentTerms,
    terms,
    businessNotes,
    customerNotes,
    status,
    prefix: business?.quotationPrefix || 'QT',
  });

  const handleSave = async (status = QUOTATION_STATUS.DRAFT) => {
    if (!customerId) return showError('Please select a customer');
    if (items.length === 0 || !items[0].productId) return showError('Add at least one item');
    setSaving(true);
    try {
      const newQuot = await quotationService.createQuotation(buildPayload(status));
      showSuccess(status === QUOTATION_STATUS.SENT ? 'Quotation sent!' : 'Quotation saved as draft');
      router.push(`/business/quotations/${newQuot.id}`);
    } catch (err) {
      showError('Failed to save quotation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 5 }}>
        <IconButton onClick={() => router.back()} sx={{ bgcolor: 'background.paper' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>New Quotation</Typography>
          {sourceRequest && (
            <Typography variant="body2" color="text.secondary">
              Based on request: <strong>{sourceRequest.id}</strong>
            </Typography>
          )}
        </Box>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={() => handleSave(QUOTATION_STATUS.DRAFT)}
          disabled={saving}
        >
          Save Draft
        </Button>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={() => handleSave(QUOTATION_STATUS.SENT)}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Send to Customer'}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Main Builder */}
        <Grid xs={12} lg={8}>

          {/* Customer & Dates */}
          <Card sx={{ borderRadius: 3, mb: 5 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Quotation Details</Typography>
              <Divider sx={{ mb: 4 }} />
              <Grid container spacing={4}>
                <Grid xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Customer</InputLabel>
                    <Select
                      value={customerId}
                      label="Customer"
                      onChange={(e) => setCustomerId(e.target.value)}
                    >
                      {customers.map(c => (
                        <MenuItem key={c.id} value={c.id}>{c.name} ({c.companyName})</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    label="Quotation Date"
                    type="date"
                    value={quotationDate}
                    onChange={(e) => setQuotationDate(e.target.value)}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    label="Expiry Date"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card sx={{ borderRadius: 3, mb: 5 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Line Items</Typography>
                <Button startIcon={<AddIcon />} onClick={handleAddItem} variant="outlined">
                  Add Item
                </Button>
              </Box>
              <Divider sx={{ mb: 4 }} />

              {items.length === 0 ? (
                <Alert severity="info">Add at least one item to the quotation.</Alert>
              ) : (
                items.map((item, index) => (
                  <LineItemRow
                    key={index}
                    item={item}
                    index={index}
                    products={products}
                    onUpdate={handleItemUpdate}
                    onRemove={handleItemRemove}
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Discounts & Charges */}
          <Card sx={{ borderRadius: 3, mb: 5 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Discounts & Additional Charges</Typography>
              <Divider sx={{ mb: 4 }} />

              {/* Overall Discount */}
              <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">OVERALL DISCOUNT</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3,mt: 2 }}>
                <FormControl size="small" sx={{ width: 180 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={overallDiscount.type}
                    label="Type"
                    onChange={(e) => setOverallDiscount(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <MenuItem value={DISCOUNT_TYPE.NONE}>None</MenuItem>
                    <MenuItem value={DISCOUNT_TYPE.PERCENTAGE}>Percentage (%)</MenuItem>
                    <MenuItem value={DISCOUNT_TYPE.FIXED}>Fixed Amount (₹)</MenuItem>
                  </Select>
                </FormControl>
                {overallDiscount.type !== DISCOUNT_TYPE.NONE && (
                  <TextField
                    label="Value"
                    type="number"
                    value={overallDiscount.value}
                    onChange={(e) => setOverallDiscount(prev => ({ ...prev, value: Number(e.target.value) }))}
                    size="small"
                    sx={{ width: 130 }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            {overallDiscount.type === DISCOUNT_TYPE.PERCENTAGE ? '%' : '₹'}
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                )}
              </Box>

              {/* Special Discounts */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">SPECIAL DISCOUNTS</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setSpecialDiscounts(prev => [...prev, { name: '', type: DISCOUNT_TYPE.PERCENTAGE, value: 0 }])}
                >
                  Add
                </Button>
              </Box>
              {specialDiscounts.map((d, i) => (
                <DiscountRow key={i} discount={d} index={i} onUpdate={handleSpecialDiscountUpdate} onRemove={handleSpecialDiscountRemove} />
              ))}

              <Divider sx={{ my: 3 }} />

              {/* Additional Charges */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">ADDITIONAL CHARGES</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setAdditionalCharges(prev => [...prev, { name: '', amount: 0, taxable: false, taxPercent: 18 }])}
                >
                  Add
                </Button>
              </Box>
              {additionalCharges.map((c, i) => (
                <ChargeRow key={i} charge={c} index={i} onUpdate={handleChargeUpdate} onRemove={handleChargeRemove} />
              ))}
            </CardContent>
          </Card>

          {/* Terms & Notes */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Terms & Notes</Typography>
              <Divider sx={{ mb: 4 }} />
              <Grid container spacing={4}>
                <Grid xs={12}>
                  <TextField
                    label="Payment Terms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    fullWidth
                    placeholder="e.g., 50% advance, 50% on delivery"
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    label="Terms & Conditions"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Valid for 30 days. Subject to applicable taxes..."
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    label="Internal Notes (not visible to customer)"
                    value={businessNotes}
                    onChange={(e) => setBusinessNotes(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    label="Customer Note"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Live Preview Accordion */}
          {settings && customers.find(c => c.id === customerId) && (
            <Accordion sx={{ borderRadius: 3, mb: 5, overflow: 'hidden', '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.50' }}>
                <Typography variant="h6" fontWeight={600}>Live Document Preview</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'grey.200', p: 4, display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
                <Box sx={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
                  <QuotationDocument
                    business={business}
                    customer={customers.find(c => c.id === customerId) || {}}
                    quotation={{
                      quotationNumber: 'DRAFT',
                      quotationDate,
                      expiryDate,
                      items,
                      overallDiscount,
                      specialDiscounts,
                      additionalCharges,
                      paymentTerms,
                      terms,
                      customerNotes,
                      businessNotes,
                    }}
                    settings={settings}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </Grid>

        {/* Right Sidebar: Totals */}
        <Grid xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, position: 'sticky', top: 80 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={3}>Price Summary</Typography>
              <QuotationTotals totals={totals} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function QuotationBuilderPage() {
  return (
    <Suspense fallback={<Typography sx={{ mt: 4 }}>Loading builder...</Typography>}>
      <QuotationBuilderInner />
    </Suspense>
  );
}
