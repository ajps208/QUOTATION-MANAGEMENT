'use client';
import { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Button, IconButton, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
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
import { formatDate } from '@/utils/formatters';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import QuotationDocument from '@/components/quotation/QuotationDocument';

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
    const observer = new ResizeObserver(() => calculateScale());
    observer.observe(el);
    return () => observer.disconnect();
  }, [calculateScale, containerRef]);

  return scale;
}

export default function CustomerQuotationDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const docWrapperRef = useRef(null);
  const scale = useResponsiveScale(docWrapperRef);

  const [quotation, setQuotation] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const initRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const quot = await quotationService.getQuotationById(id, user?.id);
      setQuotation(quot);

      if (quot.status !== QUOTATION_STATUS.SENT) {
        showError('Quotation details are only available when the quotation has been sent.');
        router.push('/customer/quotations');
        return;
      }

      const [cust, biz] = await Promise.all([
        customerService.getCustomerById(quot.customerId).catch(() => null),
        businessService.getBusinessById(quot.businessId).catch(() => null),
      ]);
      setCustomer(cust);
      setBusiness(biz);
    } catch (err) {
      showError('Quotation not found or not available for viewing.');
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

  const handleStatusChange = async (status, reason) => {
    try {
      const updates = { status };
      if (status === QUOTATION_STATUS.REJECTED && reason) {
        updates.rejectionReason = reason;
      }
      await quotationService.updateQuotation(id, updates);
      showSuccess(`Quotation ${status.toLowerCase()}`);
      fetchData();
    } catch (err) {
      showError('Failed to update status');
    } finally {
      setConfirmAction(null);
      setRejectDialogOpen(false);
      setRejectReason('');
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return;
    handleStatusChange(QUOTATION_STATUS.REJECTED, rejectReason.trim());
  };

  if (loading) return <Typography sx={{ mt: 4 }}>Loading quotation...</Typography>;
  if (!quotation || !business || !customer) return null;

  const canRespond = [QUOTATION_STATUS.SENT, QUOTATION_STATUS.VIEWED, QUOTATION_STATUS.REVISED].includes(quotation.status);
  const settings = quotation.settings || null;

  return (
    <Box>
      {/* Header */}
      <Box className="no-print" sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 3, md: 4 }, flexWrap: 'wrap' }}>
        <IconButton onClick={() => router.push('/customer/quotations')} sx={{ bgcolor: 'background.paper', flexShrink: 0 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>{quotation.quotationNumber}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
            From <strong>{business?.name}</strong> • {formatDate(quotation.quotationDate)} • Valid until {formatDate(quotation.expiryDate)}
          </Typography>
        </Box>
        <StatusChip status={quotation.status} />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <Button startIcon={<PrintIcon />} onClick={() => window.print()} variant="outlined" size="small" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            Print / PDF
          </Button>
          {canRespond && (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => setRejectDialogOpen(true)}
                sx={{ flex: { xs: 1, sm: 'none' } }}
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
                sx={{ flex: { xs: 1, sm: 'none' } }}
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
      </Box>

      {/* Rejection Reason */}
      {quotation.status === QUOTATION_STATUS.REJECTED && quotation.rejectionReason && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Rejection Reason</Typography>
          <Typography variant="body2">{quotation.rejectionReason}</Typography>
        </Alert>
      )}

      {/* Quotation Document */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box className="print-container" ref={docWrapperRef} sx={{ width: '100%', maxWidth: 1400 }}>
          <Box sx={{ width: A4_WIDTH * scale, height: A4_HEIGHT * scale, position: 'relative', overflow: 'hidden', mx: 'auto' }}>
            <Box className="quotation-doc-scaler" sx={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: A4_WIDTH, position: 'absolute', top: 0, left: 0 }}>
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
        </Box>
      </Box>

      {/* Accept Confirmation Dialog */}
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

      {/* Reject Dialog with Reason */}
      <Dialog open={rejectDialogOpen} onClose={() => { setRejectDialogOpen(false); setRejectReason(''); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Reject Quotation</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting {quotation.quotationNumber}.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={3}
            fullWidth
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button onClick={() => { setRejectDialogOpen(false); setRejectReason(''); }} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleRejectSubmit}
            color="error"
            variant="contained"
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
