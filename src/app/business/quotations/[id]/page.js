'use client';
import { useState, useEffect, use, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Button, IconButton, Alert,
  Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';

import { quotationService } from '@/services/quotationService';
import { customerService } from '@/services/customerService';
import { businessService } from '@/services/businessService';
import { quotationSettingsService } from '@/services/quotationSettingsService';
import { useAuthStore } from '@/store/useAuthStore';
import { useSnackbar } from '@/hooks/useSnackbar';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { formatDate } from '@/utils/formatters';
import { flattenBusiness } from '@/utils/businessHelpers';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import QuotationDocument from '@/components/quotation/QuotationDocument';
import RevisionDiffView from '@/components/quotation/RevisionDiffView';
import RevisionTimeline from '@/components/quotation/RevisionTimeline';

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

export default function QuotationDetailPage({ params }) {
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
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [revisionRefreshKey, setRevisionRefreshKey] = useState(0);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [requestChangesOpen, setRequestChangesOpen] = useState(false);
  const [requestChangesRemarks, setRequestChangesRemarks] = useState('');
  const [editSendOpen, setEditSendOpen] = useState(false);
  const [editSendRemarks, setEditSendRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const initRef = useRef(null);

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
    if (id && !initRef.current) {
      initRef.current = true;
      fetchData();
    }
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

  const handleBusinessAction = async (action, payload = {}) => {
    try {
      setActionLoading(true);
      await quotationService.businessAction(id, {
        userId: user?.id,
        action,
        ...payload,
      });
      const messages = {
        approve: 'Revision approved',
        reject: 'Revision rejected',
        request_changes: 'Changes requested',
        edit_and_send: 'Quotation updated and sent',
      };
      showSuccess(messages[action] || 'Action completed');
      setRevisionRefreshKey(prev => prev + 1);
      fetchData();
    } catch (err) {
      showError(err.message || 'Failed to perform action');
    } finally {
      setActionLoading(false);
      setRejectDialogOpen(false);
      setRejectReason('');
      setRequestChangesOpen(false);
      setRequestChangesRemarks('');
      setEditSendOpen(false);
      setEditSendRemarks('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    if (!customer?.phone) {
      showError('Customer has no phone number on record.');
      return;
    }
    
    const flatBiz = flattenBusiness(business);
    const message = `Hello ${customer.name}, your quotation ${quotation.quotationNumber} from ${flatBiz.name} is ready.`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${customer.phone}?text=${encodedMessage}`;
    
    window.open(url, '_blank');
  };

  if (loading) return <Typography sx={{ mt: 4 }}>Loading quotation...</Typography>;
  if (!quotation || !business || !customer || !settings) return null;

  const canSend = quotation.status === QUOTATION_STATUS.DRAFT;
  const canCancel = ![QUOTATION_STATUS.CANCELLED, QUOTATION_STATUS.ACCEPTED].includes(quotation.status);
  const isPendingApproval = quotation.status === QUOTATION_STATUS.PENDING_BUSINESS_APPROVAL;

  return (
    <Box>
      {/* Header - Hidden during print */}
      <Box className="no-print" sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 3, md: 4 }, flexWrap: 'wrap' }}>
        <IconButton onClick={() => router.push('/business/quotations')} sx={{ bgcolor: 'background.paper', flexShrink: 0 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>{quotation.quotationNumber}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
            Created {formatDate(quotation.createdAt)} • Expires {formatDate(quotation.expiryDate)}
          </Typography>
          {quotation.revision > 0 && (
            <Typography variant="caption" color="text.secondary">Revision {quotation.revision}</Typography>
          )}
        </Box>
        <StatusChip status={quotation.status} />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <Button startIcon={<PrintIcon />} onClick={handlePrint} variant="outlined" size="small" sx={{ display: { xs: 'none', sm: 'flex' } }}>
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
              sx={{ flex: { xs: 1, sm: 'none' } }}
            >
              Send to Customer
            </Button>
          )}
          <Button
            variant="outlined"
            color="success"
            startIcon={<WhatsAppIcon />}
            onClick={handleWhatsApp}
            size="small"
          >
            WhatsApp
          </Button>
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
      </Box>

      {/* Pending Business Approval Actions */}
      {isPendingApproval && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button size="small" variant="contained" color="success" startIcon={<CheckCircleIcon />}
                onClick={() => handleBusinessAction('approve')} disabled={actionLoading}>
                Approve
              </Button>
              <Button size="small" variant="outlined" color="error"
                onClick={() => setRejectDialogOpen(true)} disabled={actionLoading}>
                Reject
              </Button>
              <Button size="small" variant="outlined" color="warning"
                onClick={() => setRequestChangesOpen(true)} disabled={actionLoading}>
                Request Changes
              </Button>
              <Button size="small" variant="outlined" color="info" startIcon={<EditIcon />}
                onClick={() => setEditSendOpen(true)} disabled={actionLoading}>
                Edit & Send Back
              </Button>
            </Box>
          }
        >
          <Typography variant="subtitle2">Customer has submitted a revision</Typography>
          <Typography variant="body2">Review the changes below and take action.</Typography>
        </Alert>
      )}

      {/* Rejection Reason */}
      {quotation.status === QUOTATION_STATUS.REJECTED && quotation.rejectionReason && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Rejection Reason</Typography>
          <Typography variant="body2">{quotation.rejectionReason}</Typography>
        </Alert>
      )}

      {/* Revision Requested Info */}
      {quotation.status === QUOTATION_STATUS.REVISION_REQUESTED && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Changes Requested</Typography>
          <Typography variant="body2">You have requested changes. Waiting for the customer to submit a revision.</Typography>
        </Alert>
      )}

      {/* Tabs */}
      <Box className="no-print" sx={{ mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Quotation" />
          <Tab label="Changes" />
          <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><HistoryIcon sx={{ fontSize: 18 }} /> History</Box>} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
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
      )}

      {activeTab === 1 && (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <RevisionDiffView quotationId={id} refreshKey={revisionRefreshKey} />
          {quotation.revision === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              No changes to display yet.
            </Typography>
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          <RevisionTimeline quotationId={id} refreshKey={revisionRefreshKey} />
        </Box>
      )}

      {/* Confirm Dialogs */}
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

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => { setRejectDialogOpen(false); setRejectReason(''); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Reject Revision</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting the customer&apos;s revision.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={3}
            fullWidth
            label="Rejection Reason *"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button onClick={() => { setRejectDialogOpen(false); setRejectReason(''); }} color="inherit">Cancel</Button>
          <Button onClick={() => handleBusinessAction('reject', { rejectionReason: rejectReason.trim() })} color="error" variant="contained" disabled={!rejectReason.trim() || actionLoading}>
            {actionLoading ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={requestChangesOpen} onClose={() => { setRequestChangesOpen(false); setRequestChangesRemarks(''); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Request Changes</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Provide feedback or instructions for the customer.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={3}
            fullWidth
            label="Remarks *"
            value={requestChangesRemarks}
            onChange={(e) => setRequestChangesRemarks(e.target.value)}
            placeholder="What changes are needed..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button onClick={() => { setRequestChangesOpen(false); setRequestChangesRemarks(''); }} color="inherit">Cancel</Button>
          <Button onClick={() => handleBusinessAction('request_changes', { remarks: requestChangesRemarks.trim() })} color="warning" variant="contained" disabled={!requestChangesRemarks.trim() || actionLoading}>
            {actionLoading ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit & Send Back Dialog */}
      <Dialog open={editSendOpen} onClose={() => { setEditSendOpen(false); setEditSendRemarks(''); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Edit & Send Back</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add any notes before sending the updated quotation back to the customer.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={3}
            fullWidth
            label="Notes"
            value={editSendRemarks}
            onChange={(e) => setEditSendRemarks(e.target.value)}
            placeholder="Optional notes..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button onClick={() => { setEditSendOpen(false); setEditSendRemarks(''); }} color="inherit">Cancel</Button>
          <Button onClick={() => handleBusinessAction('edit_and_send', { remarks: editSendRemarks.trim() })} color="info" variant="contained" disabled={actionLoading}>
            {actionLoading ? 'Sending...' : 'Send to Customer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
