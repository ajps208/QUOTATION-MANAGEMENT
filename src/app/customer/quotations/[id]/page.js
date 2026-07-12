'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, Typography, Button, Grid, Divider, IconButton, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PrintIcon from '@mui/icons-material/Print';

import { quotationService } from '@/services/quotationService';
import { businessService } from '@/services/businessService';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';
import { useAuthStore } from '@/store/useAuthStore';
import { useSnackbar } from '@/hooks/useSnackbar';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { formatCurrency, formatDate } from '@/utils/formatters';
import StatusChip from '@/components/common/StatusChip';
import QuotationTotals from '@/app/business/quotations/components/QuotationTotals';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export default function CustomerQuotationDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  const [quotation, setQuotation] = useState(null);
  const [business, setBusiness] = useState(null);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchData = async () => {
    try {
      const quot = await quotationService.getQuotationById(id);
      setQuotation(quot);
      setTotals(calculateQuotationTotals(quot));
      const biz = await businessService.getBusinessById(quot.businessId).catch(() => null);
      setBusiness(biz);
    } catch (err) {
      showError('Quotation not found');
      router.push('/customer/quotations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      await quotationService.updateQuotationStatus(id, status);
      showSuccess(`Quotation ${status.toLowerCase()}`);
      fetchData();
    } catch (err) {
      showError('Failed to update status');
    } finally {
      setConfirmAction(null);
    }
  };

  if (loading) return <Typography sx={{ mt: 4 }}>Loading quotation...</Typography>;
  if (!quotation) return null;

  const canRespond = [QUOTATION_STATUS.SENT, QUOTATION_STATUS.VIEWED, QUOTATION_STATUS.REVISED].includes(quotation.status);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <IconButton onClick={() => router.push('/customer/quotations')} sx={{ bgcolor: 'background.paper' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>{quotation.quotationNumber}</Typography>
          <Typography variant="body2" color="text.secondary">
            From <strong>{business?.name}</strong> • {formatDate(quotation.quotationDate)} • Valid until {formatDate(quotation.expiryDate)}
          </Typography>
        </Box>
        <StatusChip status={quotation.status} />
        <Button startIcon={<PrintIcon />} onClick={() => window.print()} variant="outlined" size="small">
          Print / PDF
        </Button>
        {canRespond && (
          <>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setConfirmAction({
                title: 'Reject Quotation',
                message: 'Are you sure you want to reject this quotation?',
                status: QUOTATION_STATUS.REJECTED,
                color: 'error'
              })}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => setConfirmAction({
                title: 'Accept Quotation',
                message: `You are accepting ${quotation.quotationNumber} for ${formatCurrency(quotation.grandTotal)}. This confirms your intent to proceed.`,
                status: QUOTATION_STATUS.ACCEPTED,
                color: 'success'
              })}
            >
              Accept
            </Button>
          </>
        )}
        {quotation.status === QUOTATION_STATUS.ACCEPTED && (
          <Alert severity="success" sx={{ borderRadius: 2 }}>You accepted this quotation.</Alert>
        )}
        {quotation.status === QUOTATION_STATUS.REJECTED && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>You rejected this quotation.</Alert>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid xs={12} lg={8}>
          {/* Vendor & Customer Info */}
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={4}>
                <Grid xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1}>FROM (VENDOR)</Typography>
                  <Typography variant="body1" fontWeight={700}>{business?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{business?.email}</Typography>
                  <Typography variant="body2" color="text.secondary">{business?.phone}</Typography>
                  <Typography variant="body2" color="text.secondary">{business?.city}, {business?.country}</Typography>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1}>TO</Typography>
                  <Typography variant="body1" fontWeight={700}>{user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{user?.company}</Typography>
                  <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600}>Items</Typography>
              </Box>
              <Divider />
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                      {['Item', 'Qty', 'Unit Price', 'Discount', 'Tax', 'Total'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Item' ? 'left' : 'right', fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(totals?.lineItems || quotation.items).map((item, i) => {
                      const discountAmt = item.discount || 0;
                      const taxAmt = item.tax || 0;
                      const lineTotal = item.total || ((item.quantity * item.unitPrice) - discountAmt + taxAmt);
                      return (
                        <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <Typography variant="body2">{item.quantity}</Typography>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <Typography variant="body2">{formatCurrency(item.unitPrice)}</Typography>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <Typography variant="body2" color={discountAmt > 0 ? 'success.main' : 'text.secondary'}>
                              {discountAmt > 0 ? `- ${formatCurrency(discountAmt)}` : '—'}
                            </Typography>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <Typography variant="body2">{formatCurrency(taxAmt)}</Typography>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight={700}>{formatCurrency(lineTotal)}</Typography>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>

          {(quotation.paymentTerms || quotation.terms) && (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>Terms & Conditions</Typography>
                {quotation.paymentTerms && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary" mb={0.5}>PAYMENT TERMS</Typography>
                    <Typography variant="body2">{quotation.paymentTerms}</Typography>
                  </Box>
                )}
                {quotation.terms && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" mb={0.5}>CONDITIONS</Typography>
                    <Typography variant="body2">{quotation.terms}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right: Totals */}
        <Grid xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, position: 'sticky', top: 80 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={3}>Price Breakdown</Typography>
              <QuotationTotals totals={totals} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {confirmAction && (
        <ConfirmDialog
          open={!!confirmAction}
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.status === QUOTATION_STATUS.ACCEPTED ? 'Accept' : 'Reject'}
          confirmColor={confirmAction.color}
          onConfirm={() => handleStatusChange(confirmAction.status)}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </Box>
  );
}
