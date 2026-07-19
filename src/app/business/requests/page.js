'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Chip, Button, Card, CardContent,
  Grid, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Tooltip, IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationRequestService } from '@/services/quotationRequestService';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import AppSearch from '@/components/common/AppSearch';
import EmptyState from '@/components/common/EmptyState';
import AppFilter from '@/components/common/AppFilter';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { TableLoader, SkeletonLoader } from '@/components/common/LoadingState';
import { useSnackbar } from '@/hooks/useSnackbar';
import { formatDate } from '@/utils/formatters';
import { REQUEST_STATUS } from '@/constants/statuses';
import RequestDetailDialog from './components/RequestDetailDialog';

export default function CustomerRequestsPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectRequest, setRejectRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const reqs = await quotationRequestService.getRequestsByBusiness(user.businessId);
      setRequests(reqs.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)));
    } catch (err) {
      setError(err);
      showError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [user?.id, showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleView = (req) => {
    setSelectedRequest(req);
    setDetailOpen(true);
  };

  const handleStatusUpdate = async (id, status, reason = '', rejectedBy = '') => {
    try {
      await quotationRequestService.updateRequest(id, { status, rejectionReason: reason, rejectedBy, rejectedAt: new Date().toISOString() });
      showSuccess(`Request status updated to ${status}`);
      fetchData();
    } catch (err) {
      showError('Failed to update status');
    }
  };

  const handleRejectOpen = (req) => {
    setRejectRequest(req);
    setRejectOpen(true);
    setRejectionReason('');
  };

  const handleRejectCancel = () => {
    setRejectOpen(false);
    setRejectRequest(null);
    setRejectionReason('');
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim() || !rejectRequest) return;
    try {
      await quotationRequestService.updateRequest(rejectRequest.id, {
        status: REQUEST_STATUS.REJECTED,
        rejectionReason: rejectionReason.trim(),
        rejectedBy: user?.id,
        rejectedAt: new Date().toISOString()
      });
      showSuccess('Request rejected');
      fetchData();
      handleRejectCancel();
    } catch (err) {
      showError('Failed to reject request');
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const customerName = r.customerInfo?.name || '';
      const matchSearch = r.id.toLowerCase().includes(search.toLowerCase()) ||
        customerName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === '' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, search, statusFilter]);

  const statusOptions = useMemo(() => 
    Object.values(REQUEST_STATUS).map(s => ({ label: s, value: s }))
  , []);

  const handleRefresh = () => {
    fetchData();
  };

  if (loading && requests.length === 0) {
    return (
      <Box>
        <PageHeader
          title="Quotation Requests"
          subtitle="Review and respond to incoming requests from customers"
        />
        <TableLoader columns={7} rows={8} showToolbar={true} />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Quotation Requests"
        subtitle="Review and respond to incoming requests from customers"
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <AppSearch value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by request ID or customer..." />
        <AppFilter label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} />
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading} size="small" sx={{ color: loading ? 'text.disabled' : 'text.secondary' }}>
              <RefreshIcon fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>

      {error && !loading && (
        <ErrorState
          error={error}
          onRetry={handleRefresh}
          variant="card"
          size="md"
          retryLabel="Retry"
        />
      )}

      {filteredRequests.length === 0 && !loading && !error && (
        <EmptyState
          type="requests"
          variant="card"
          size="md"
        />
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {filteredRequests.map((req) => {
          return (
            <Box key={req.id}>
              <Card sx={{ borderRadius: 1, '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>{req.id}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        From: <strong>{req.customerInfo?.name || req.customerId}</strong> {req.customerInfo?.company ? `(${req.customerInfo.company})` : ''} • {formatDate(req.requestDate)}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                        {req.items.map((item, i) => (
                          <Chip key={i} label={`${item.name} × ${item.quantity}`} size="small" variant="outlined" />
                        ))}
                      </Stack>
                      {req.generalNote && (
                        <Typography variant="caption" color="text.secondary">
                          Note: {req.generalNote}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5 }}>
                      <StatusChip status={req.status} />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleView(req)}>
                          View
                        </Button>
                        {[REQUEST_STATUS.SUBMITTED, REQUEST_STATUS.UNDER_REVIEW, REQUEST_STATUS.APPROVED].includes(req.status) && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<DescriptionIcon />}
                            onClick={() => {
                              if (req.status === REQUEST_STATUS.SUBMITTED) {
                                handleStatusUpdate(req.id, REQUEST_STATUS.UNDER_REVIEW);
                              }
                              router.push(`/business/quotations/new?requestId=${req.id}&customerId=${req.resolvedCustomerId || ''}`);
                            }}
                          >
                            Create Quotation
                          </Button>
                        )}
                        {[REQUEST_STATUS.SUBMITTED, REQUEST_STATUS.UNDER_REVIEW, REQUEST_STATUS.APPROVED].includes(req.status) && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => handleRejectOpen(req)}
                          >
                            Reject Request
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

      {detailOpen && selectedRequest && (
        <RequestDetailDialog
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          request={selectedRequest}
          onStatusUpdate={(status, reason) => {
            handleStatusUpdate(selectedRequest.id, status, reason, user?.id);
            setDetailOpen(false);
          }}
        />
      )}

      {rejectOpen && rejectRequest && (
        <Dialog open={rejectOpen} onClose={handleRejectCancel} maxWidth="sm" fullWidth>
          <DialogTitle>Reject Request: {rejectRequest.id}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" paragraph="true">
              Are you sure you want to reject this request from <strong>{rejectRequest.customerInfo?.name || rejectRequest.customerId}</strong>?
            </Typography>
            <Typography variant="body2" color="error.main" fontWeight={600} sx={{ mb: 1 }}>
              Rejection Reason (required - will be sent to customer)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Please provide a reason for rejecting this request..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              autoFocus
              error={rejectOpen && !rejectionReason.trim()}
              helperText={rejectOpen && !rejectionReason.trim() ? 'A rejection reason is required' : undefined}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRejectCancel} color="inherit">Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}