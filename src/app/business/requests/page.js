'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Chip, Button, Card, CardContent,
  Grid, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationRequestService } from '@/services/quotationRequestService';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import AppSearch from '@/components/common/AppSearch';
import EmptyState from '@/components/common/EmptyState';
import AppFilter from '@/components/common/AppFilter';
import { useSnackbar } from '@/hooks/useSnackbar';
import { formatDate } from '@/utils/formatters';
import { REQUEST_STATUS } from '@/constants/statuses';
import RequestDetailDialog from './components/RequestDetailDialog';

export default function BusinessRequestsPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchData = async () => {
    if (!user?.businessId) return;
    try {
      const reqs = await quotationRequestService.getRequestsByBusiness(user.businessId);
      setRequests(reqs.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)));
    } catch (err) {
      showError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleView = (req) => {
    setSelectedRequest(req);
    setDetailOpen(true);
  };

  const handleStatusUpdate = async (id, status, reason = '') => {
    try {
      await quotationRequestService.updateRequest(id, { status, rejectionReason: reason });
      showSuccess(`Request status updated to ${status}`);
      fetchData();
    } catch (err) {
      showError('Failed to update status');
    }
  };

  const filteredRequests = requests.filter(r => {
    const customerName = r.customerInfo?.name || '';
    const matchSearch = r.id.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === '' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusOptions = Object.values(REQUEST_STATUS).map(s => ({ label: s, value: s }));

  if (loading) return <Typography sx={{ mt: 4 }}>Loading requests...</Typography>;

  return (
    <Box>
      <PageHeader
        title="Quotation Requests"
        subtitle="Review and respond to incoming requests from customers"
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <AppSearch value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by request ID or customer..." />
        <AppFilter label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} />
      </Box>

      {filteredRequests.length === 0 ? (
        <EmptyState
          title="No requests found"
          description={search || statusFilter ? 'Try adjusting your filters.' : 'You have not received any quotation requests yet.'}
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredRequests.map((req) => {
            return (
              <Box key={req.id}>
                <Card sx={{ borderRadius: 1, '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>{req.id}</Typography>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          From: <strong>{req.customerInfo?.name || req.customerId}</strong> {req.customerInfo?.company ? `(${req.customerInfo.company})` : ''} • {formatDate(req.requestDate)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                          {req.items.map((item, i) => (
                            <Chip key={i} label={`${item.name} × ${item.quantity}`} size="small" variant="outlined" />
                          ))}
                        </Box>
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
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}

      {detailOpen && selectedRequest && (
        <RequestDetailDialog
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          request={selectedRequest}
          onStatusUpdate={(status, reason) => {
            handleStatusUpdate(selectedRequest.id, status, reason);
            setDetailOpen(false);
          }}
        />
      )}
    </Box>
  );
}
