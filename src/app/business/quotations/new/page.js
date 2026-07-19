'use client';

import { useState, useEffect, useMemo, Suspense, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box, Grid, Typography, Button,
  Divider, Accordion,
  AccordionSummary, AccordionDetails, IconButton,
  Alert, InputAdornment, Autocomplete, TextField, Chip, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockIcon from '@mui/icons-material/Lock';

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
import { quotationSettingsService } from '@/services/quotationSettingsService';
import FormSection from '@/components/common/FormSection';
import FormField from '@/components/common/FormField';
import FormGrid from '@/components/common/FormGrid';
import AppButton from '@/components/common/AppButton';
import CustomerDialog from '@/app/business/customers/components/CustomerDialog';

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

function useResponsiveScale(containerRef) {
  const [scale, setScale] = useState(1);

  const calculateScale = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    if (containerWidth <= 0) return;
    const newScale = Math.min(1, containerWidth / A4_WIDTH);
    setScale(newScale);
  }, [containerRef]);

  useEffect(() => {
    calculateScale();
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      calculateScale();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [calculateScale, containerRef]);

  return scale;
}

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
  const previewWrapperRef = useRef(null);
  const previewScale = useResponsiveScale(previewWrapperRef);

  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  const [business, setBusiness] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [sourceRequest, setSourceRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const resolvedCustomerIdParam = searchParams.get('customerId');
  const [customerId, setCustomerId] = useState(resolvedCustomerIdParam || '');
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
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);

  const selectedCustomerObj = useMemo(() => {
    if (!customerId) return null;
    return customers.find(c => c.id === customerId) || null;
  }, [customerId, customers]);

  const initRef = useRef(false);
  useEffect(() => {
    const init = async () => {
      if (!user?.businessId) return;
      if (initRef.current) return;
      initRef.current = true;

      setLoading(true);
      setLoadError(null);
      try {
        let biz, custs, prods, sets;
        const results = await Promise.allSettled([
          businessService.getBusinessById(user.businessId),
          customerService.getCustomers(user.businessId),
          productService.getProducts(user.businessId),
          quotationSettingsService.getSettingsByBusiness(user.businessId),
        ]);

        const errors = [];
        [biz, custs, prods, sets] = results.map((r, i) => {
          if (r.status === 'fulfilled') return r.value;
          const labels = ['business', 'customers', 'products', 'settings'];
          errors.push(labels[i]);
          return null;
        });

        if (errors.length === 4) {
          throw new Error('Failed to load data');
        }

        setBusiness(biz || null);
        setCustomers(custs || []);
        setProducts(prods || []);
        setSettings(sets || null);

        if (requestId && prods) {
          const req = await quotationRequestService.getRequestById(requestId);
          setSourceRequest(req);
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
          setPaymentTerms(biz?.paymentTerms || '');
          
          if (resolvedCustomerIdParam) {
            setCustomerId(resolvedCustomerIdParam);
          }
        }
      } catch (err) {
        setLoadError(err.message || 'Failed to load data for quotation builder');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, requestId, resolvedCustomerIdParam]);

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

  const handleSaveCustomer = async (formData) => {
    try {
      const newCustomer = await customerService.createCustomer({ ...formData, businessId: user.businessId });
      showSuccess('Customer created successfully');
      const updatedCustomers = await customerService.getCustomers(user.businessId);
      setCustomers(updatedCustomers);
      setCustomerId(newCustomer.id);
      setCustomerDialogOpen(false);
    } catch (err) {
      showError('Failed to create customer');
    }
  };

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
    userId: user.id,
    userName: user.name,
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
    settings: settings || null,
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
    <Box sx={{ overflow: 'hidden' }}>
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <Typography color="text.secondary">Loading quotation builder...</Typography>
        </Box>
      )}

      {loadError && !loading && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {loadError}
        </Alert>
      )}

      {!loading && !loadError && (<>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 3, md: 4 }, flexWrap: 'wrap' }}>
        <IconButton
          onClick={() => router.back()}
          sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', flexShrink: 0 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}>
            New Quotation
          </Typography>
          {sourceRequest && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, wordBreak: 'break-word' }}>
              Based on request: <strong>{sourceRequest.id}</strong>
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          <AppButton
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={() => handleSave(QUOTATION_STATUS.DRAFT)}
            disabled={saving}
            sx={{ flex: { xs: '1 1 calc(50% - 4px)', sm: 'none' }, minWidth: 0 }}
          >
            Save Draft
          </AppButton>
          <AppButton
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => handleSave(QUOTATION_STATUS.SENT)}
            disabled={saving}
            loading={saving}
            sx={{ flex: { xs: '1 1 calc(50% - 4px)', sm: 'none' }, minWidth: 0 }}
          >
            {saving ? 'Saving...' : 'Send'}
          </AppButton>
        </Box>
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }}>
        {/* Main Builder Column */}
        <Grid xs={12} lg={8}>

          {/* Customer & Dates */}
          <FormSection
            title="Customer Details"
            description={requestId ? "Customer is assigned from the request" : "Select or add a customer for this quotation"}
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            <FormGrid spacing={2.5}>
              {requestId && customerId ? (
                <Box sx={{
                  width: '100%',
                  p: 2.5,
                  bgcolor: '#F8FAFC',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: '#E2E8F0',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LockIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                      Customer (Locked to Request)
                    </Typography>
                  </Box>
                  {selectedCustomerObj ? (
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedCustomerObj.name}
                      </Typography>
                      {selectedCustomerObj.companyName && (
                        <Typography variant="body2" color="text.secondary">{selectedCustomerObj.companyName}</Typography>
                      )}
                      <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
                        {selectedCustomerObj.email && <Chip label={selectedCustomerObj.email} size="small" variant="outlined" />}
                        {selectedCustomerObj.phone && <Chip label={selectedCustomerObj.phone} size="small" variant="outlined" />}
                        {selectedCustomerObj.taxNumber && <Chip label={`GST: ${selectedCustomerObj.taxNumber}`} size="small" variant="outlined" />}
                      </Stack>
                      {(selectedCustomerObj.billingAddress || selectedCustomerObj.city || selectedCustomerObj.state) && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.6 }}>
                          {[selectedCustomerObj.billingAddress, selectedCustomerObj.city, selectedCustomerObj.state, selectedCustomerObj.postalCode].filter(Boolean).join(', ')}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body1" fontWeight={600}>Loading customer...</Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Autocomplete
                        options={customers}
                        getOptionLabel={(option) => option.name ? `${option.name}${option.companyName ? ` (${option.companyName})` : ''}` : ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={selectedCustomerObj}
                        onChange={(e, newValue) => {
                          setCustomerId(newValue?.id || '');
                        }}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>{option.name}</Typography>
                              {option.companyName && (
                                <Typography variant="caption" color="text.secondary">{option.companyName}</Typography>
                              )}
                            </Box>
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search Customer"
                            placeholder="Type to search..."
                            required={!customerId}
                          />
                        )}
                        fullWidth
                      />
                    </Box>
                    <AppButton
                      variant="outlined"
                      startIcon={<PersonAddIcon />}
                      onClick={() => setCustomerDialogOpen(true)}
                      sx={{ flexShrink: 0, mt: '2px', height: 56 }}
                    >
                      Add
                    </AppButton>
                  </Box>
                  {selectedCustomerObj && (
                    <Box sx={{
                      mt: 2,
                      p: 2.5,
                      bgcolor: '#F8FAFC',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: '#E2E8F0',
                    }}>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, mb: 1.5 }}>
                        Customer Details
                      </Typography>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>{selectedCustomerObj.name}</Typography>
                        {selectedCustomerObj.companyName && (
                          <Typography variant="body2" color="text.secondary">{selectedCustomerObj.companyName}</Typography>
                        )}
                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                          {selectedCustomerObj.email && <Chip label={selectedCustomerObj.email} size="small" variant="outlined" />}
                          {selectedCustomerObj.phone && <Chip label={selectedCustomerObj.phone} size="small" variant="outlined" />}
                          {selectedCustomerObj.taxNumber && <Chip label={`GST: ${selectedCustomerObj.taxNumber}`} size="small" variant="outlined" />}
                        </Stack>
                        {(selectedCustomerObj.billingAddress || selectedCustomerObj.city || selectedCustomerObj.state) && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                            {[selectedCustomerObj.billingAddress, selectedCustomerObj.city, selectedCustomerObj.state, selectedCustomerObj.postalCode].filter(Boolean).join(', ')}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
              <FormField
                xs={12} sm={6}
                label="Quotation Date"
                type="date"
                value={quotationDate}
                onChange={(e) => setQuotationDate(e.target.value)}
                inputLabelProps={{ shrink: true }}
              />
              <FormField
                xs={12} sm={6}
                label="Expiry Date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                inputLabelProps={{ shrink: true }}
              />
            </FormGrid>
          </FormSection>

          {/* Line Items */}
          <FormSection
            title="Line Items"
            description="Add products or services to this quotation"
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <AppButton startIcon={<AddIcon />} onClick={handleAddItem} variant="outlined" size="small">
                Add Item
              </AppButton>
            </Box>

            {items.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2, fontSize: '0.875rem' }}>
                Add at least one item to the quotation.
              </Alert>
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
          </FormSection>

          {/* Discounts & Charges */}
          <FormSection
            title="Discounts & Additional Charges"
            description="Apply discounts and add extra charges"
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            {/* Overall Discount */}
            <Box>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6875rem', display: 'block', mb: 1.5 }}>
                Overall Discount
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormField
                  select
                  label="Discount Type"
                  value={overallDiscount.type}
                  onChange={(e) => setOverallDiscount(prev => ({ ...prev, type: e.target.value }))}
                  size="small"
                  sx={{ minWidth: 180, flex: { xs: '1 1 100%', sm: '0 1 auto' } }}
                  options={[
                    { value: DISCOUNT_TYPE.NONE, label: 'No Discount' },
                    { value: DISCOUNT_TYPE.PERCENTAGE, label: 'Percentage (%)' },
                    { value: DISCOUNT_TYPE.FIXED, label: 'Fixed Amount (₹)' },
                  ]}
                />
                {overallDiscount.type !== DISCOUNT_TYPE.NONE && (
                  <FormField
                    label="Value"
                    type="number"
                    value={overallDiscount.value}
                    onChange={(e) => setOverallDiscount(prev => ({ ...prev, value: Number(e.target.value) }))}
                    size="small"
                    sx={{ width: 140, flex: { xs: '1 1 100%', sm: '0 1 auto' } }}
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
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Special Discounts */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6875rem' }}>
                Special Discounts
              </Typography>
              <AppButton
                size="small"
                startIcon={<AddIcon />}
                variant="text"
                onClick={() => setSpecialDiscounts(prev => [...prev, { name: '', type: DISCOUNT_TYPE.PERCENTAGE, value: 0 }])}
              >
                Add
              </AppButton>
            </Box>
            {specialDiscounts.map((d, i) => (
              <DiscountRow key={i} discount={d} index={i} onUpdate={handleSpecialDiscountUpdate} onRemove={handleSpecialDiscountRemove} />
            ))}

            <Divider sx={{ my: 1 }} />

            {/* Additional Charges */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6875rem' }}>
                Additional Charges
              </Typography>
              <AppButton
                size="small"
                startIcon={<AddIcon />}
                variant="text"
                onClick={() => setAdditionalCharges(prev => [...prev, { name: '', amount: 0, taxable: false, taxPercent: 18 }])}
              >
                Add
              </AppButton>
            </Box>
            {additionalCharges.map((c, i) => (
              <ChargeRow key={i} charge={c} index={i} onUpdate={handleChargeUpdate} onRemove={handleChargeRemove} />
            ))}
          </FormSection>

          {/* Terms & Notes */}
          <FormSection
            title="Terms & Notes"
            description="Add payment terms, conditions, and notes"
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            <FormGrid spacing={2.5}>
              <FormField
                xs={12}
                label="Payment Terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="e.g., 50% advance, 50% on delivery"
              />
              <FormField
                xs={12}
                label="Terms & Conditions"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                multiline
                rows={3}
                placeholder="Valid for 30 days. Subject to applicable taxes..."
              />
              <FormField
                xs={12} sm={6}
                label="Internal Notes"
                value={businessNotes}
                onChange={(e) => setBusinessNotes(e.target.value)}
                multiline
                rows={3}
                placeholder="Not visible to customer"
                helperText="Not visible to customer"
              />
              <FormField
                xs={12} sm={6}
                label="Customer Note"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                multiline
                rows={3}
                placeholder="Message for the customer..."
              />
            </FormGrid>
          </FormSection>

          {/* Live Preview Accordion */}
          {settings && customers.find(c => c.id === customerId) && (
            <Accordion sx={{ borderRadius: 2, mb: { xs: 3, md: 4 }, overflow: 'hidden', '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#F8FAFC' }}>
                <Typography variant="h6" fontWeight={600}>Live Document Preview</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: '#F1F5F9', p: { xs: 1.5, sm: 2, md: 4 }, display: 'flex', justifyContent: 'center', overflowX: 'hidden' }}>
                <Box ref={previewWrapperRef} sx={{ width: '100%', maxWidth: A4_WIDTH }}>
                  <Box sx={{ width: A4_WIDTH * previewScale, height: A4_HEIGHT * previewScale, position: 'relative', overflow: 'hidden', mx: 'auto' }}>
                    <Box className="quotation-doc-scaler" sx={{ transform: `scale(${previewScale})`, transformOrigin: 'top left', width: A4_WIDTH, position: 'absolute', top: 0, left: 0 }}>
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
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </Grid>

        {/* Right Sidebar: Totals */}
        <Grid xs={12} lg={4}>
          <FormSection
            title="Price Summary"
            sx={{ position: { lg: 'sticky' }, top: { lg: 80 } }}
          >
            <QuotationTotals totals={totals} />
          </FormSection>
        </Grid>
      </Grid>

      {!requestId && (
        <CustomerDialog
          open={customerDialogOpen}
          onClose={() => setCustomerDialogOpen(false)}
          onSave={handleSaveCustomer}
          customer={null}
        />
      )}
      </>)}
    </Box>
  );
}

export default function QuotationBuilderPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <Typography color="text.secondary">Loading builder...</Typography>
      </Box>
    }>
      <QuotationBuilderInner />
    </Suspense>
  );
}
