'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Button, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';

import { quotationService } from '@/services/quotationService';
import { customerService } from '@/services/customerService';
import { businessService } from '@/services/businessService';
import { quotationSettingsService } from '@/services/quotationSettingsService';
import { useAuthStore } from '@/store/useAuthStore';
import { useSnackbar } from '@/hooks/useSnackbar';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { formatDate } from '@/utils/formatters';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import QuotationDocument from '@/components/quotation/QuotationDocument';

export default function QuotationDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  const [quotation, setQuotation] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [business, setBusiness] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchData = async () => {
    try {
      const quot = await quotationService.getQuotationById(id);
      setQuotation(quot);

      const [cust, biz] = await Promise.all([
        customerService.getCustomerById(quot.customerId).catch(() => null),
        businessService.getBusinessById(quot.businessId).catch(() => null),
      ]);
      setCustomer(cust);
      setBusiness(biz);

      if (biz) {
        const set = await quotationSettingsService.getSettingsByBusiness(biz.id);
        setSettings(set);
      }
    } catch (err) {
      showError('Quotation not found');
      router.push('/business/quotations');
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
      showSuccess(`Quotation marked as ${status}`);
      fetchData();
    } catch (err) {
      showError('Failed to update status');
    } finally {
      setConfirmAction(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Typography sx={{ mt: 4 }}>Loading quotation...</Typography>;
  if (!quotation || !business || !customer || !settings) return null;

  const canSend = quotation.status === QUOTATION_STATUS.DRAFT;
  const canCancel = ![QUOTATION_STATUS.CANCELLED, QUOTATION_STATUS.ACCEPTED].includes(quotation.status);

  return (
    <Box>
      {/* Header - Hidden during print */}
      <Box className="no-print" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <IconButton onClick={() => router.push('/business/quotations')} sx={{ bgcolor: 'background.paper' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>{quotation.quotationNumber}</Typography>
          <Typography variant="body2" color="text.secondary">
            Created {formatDate(quotation.createdAt)} • Expires {formatDate(quotation.expiryDate)}
          </Typography>
        </Box>
        <StatusChip status={quotation.status} />
        <Button startIcon={<PrintIcon />} onClick={handlePrint} variant="outlined" size="small">
          Print / PDF
        </Button>
        {canSend && (
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => setConfirmAction({
              title: 'Send Quotation',
              message: 'This will mark the quotation as Sent and notify the customer.',
              status: QUOTATION_STATUS.SENT,
            })}
          >
            Send to Customer
          </Button>
        )}
        {canCancel && quotation.status !== QUOTATION_STATUS.DRAFT && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => setConfirmAction({
              title: 'Cancel Quotation',
              message: 'Are you sure you want to cancel this quotation?',
              status: QUOTATION_STATUS.CANCELLED,
            })}
          >
            Cancel
          </Button>
        )}
      </Box>

      {/* Reusable Document Container */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box className="print-container">
          <QuotationDocument
            business={business}
            customer={customer}
            quotation={quotation}
            settings={settings}
            scale={1}
            printMode={false} // Will be styled via CSS media queries for actual print
          />
        </Box>
      </Box>

      {confirmAction && (
        <ConfirmDialog
          open={!!confirmAction}
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel="Confirm"
          confirmColor={confirmAction.status === QUOTATION_STATUS.CANCELLED ? 'error' : 'primary'}
          onConfirm={() => handleStatusChange(confirmAction.status)}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </Box>
  );
}
