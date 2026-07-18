'use client';
import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Button, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';

import { quotationService } from '@/services/quotationService';
import { customerService } from '@/services/customerService';
import { businessService } from '@/services/businessService';
import { useAuthStore } from '@/store/useAuthStore';
import { useSnackbar } from '@/hooks/useSnackbar';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { formatCurrency, formatDate } from '@/utils/formatters';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import QuotationDocument from '@/components/quotation/QuotationDocument';

export default function CustomerQuotationDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  const [quotation, setQuotation] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  const initRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const quot = await quotationService.getQuotationById(id);
      setQuotation(quot);

      const [cust, biz] = await Promise.all([
        customerService.getCustomerById(quot.customerId).catch(() => null),
        businessService.getBusinessById(quot.businessId).catch(() => null),
      ]);
      setCustomer(cust);
      setBusiness(biz);
    } catch (err) {
      showError('Quotation not found');
      router.push('/customer/quotations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && !initRef.current) {
      initRef.current = true;
      fetchData();
    }
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
  if (!quotation || !business || !customer) return null;

  const canRespond = [QUOTATION_STATUS.SENT, QUOTATION_STATUS.VIEWED, QUOTATION_STATUS.REVISED].includes(quotation.status);
  const settings = quotation.settings || null;

  return (
    <Box>
      {/* Header */}
      <Box className="no-print" sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <IconButton onClick={() => router.push('/customer/quotations')} sx={{ bgcolor: 'background.paper', flexShrink: 0 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>{quotation.quotationNumber}</Typography>
          <Typography variant="body2" color="text.secondary">
            From <strong>{business?.name}</strong> • {formatDate(quotation.quotationDate)} • Valid until {formatDate(quotation.expiryDate)}
          </Typography>
        </Box>
        <StatusChip status={quotation.status} />
        <Button startIcon={<PrintIcon />} onClick={() => window.print()} variant="outlined" size="small" sx={{ display: { xs: 'none', sm: 'flex' } }}>
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
                message: `You are accepting ${quotation.quotationNumber}. This confirms your intent to proceed.`,
                status: QUOTATION_STATUS.ACCEPTED,
                color: 'success'
              })}
            >
              Accept
            </Button>
          </>
        )}
        {quotation.status === QUOTATION_STATUS.ACCEPTED && (
          <Typography variant="body2" color="success.main" fontWeight={600}>You accepted this quotation.</Typography>
        )}
        {quotation.status === QUOTATION_STATUS.REJECTED && (
          <Typography variant="body2" color="error.main" fontWeight={600}>You rejected this quotation.</Typography>
        )}
      </Box>

      {/* Quotation Document — identical to business view */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box className="print-container">
          <QuotationDocument
            business={business}
            customer={customer}
            quotation={quotation}
            settings={settings}
            scale={1}
            printMode={false}
          />
        </Box>
      </Box>

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
