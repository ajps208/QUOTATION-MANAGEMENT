'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Chip, Card, CardContent, Grid, Stack, Tooltip, IconButton } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationRequestService } from '@/services/quotationRequestService';
import { businessService } from '@/services/businessService';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import EmptyState from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { TableLoader } from '@/components/common/LoadingState';
import { useSnackbar } from '@/hooks/useSnackbar';
import { formatDate } from '@/utils/formatters';

export default function CustomerRequestsPage() {
  const { user } = useAuthStore();
  const { showError } = useSnackbar();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [businesses, setBusinesses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [reqs, bizList] = await Promise.all([
        quotationRequestService.getRequestsByCustomer(user.id),
        businessService.getBusinesses(),
      ]);
      setRequests(reqs.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)));
      const bizMap = {};
      bizList.forEach(b => bizMap[b.id] = b);
      setBusinesses(bizMap);
    } catch (err) {
      setError(err);
      showError('Failed to load your requests');
    } finally {
      setLoading(false);
    }
  }, [user?.id, showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  if (loading && requests.length === 0) {
    return (
      <Box>
        <PageHeader
          title="My Requests"
          subtitle="Track the status of quotation requests you have submitted"
          actionLabel="Browse Vendors"
          actionIcon={<ReceiptIcon />}
          onAction={() => router.push('/customer/vendors')}
        />
        <TableLoader columns={6} rows={8} showToolbar={true} />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="My Requests"
        subtitle="Track the status of quotation requests you have submitted"
        actionLabel="Browse Vendors"
        actionIcon={<ReceiptIcon />}
        onAction={() => router.push('/customer/vendors')}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
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

      {requests.length === 0 && !loading && !error && (
        <EmptyState
          title="No requests found"
          description="You have not submitted any quotation requests yet. Browse vendors to get started."
        />
      )}

      {requests.length > 0 && (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {requests.map((req) => {
            const vendor = businesses[req.businessId];
            return (
              <Grid xs={12} key={req.id}>
                <Card sx={{ borderRadius: 1 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>{req.id}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          To: <strong>{vendor?.name || req.businessId}</strong> • {formatDate(req.requestDate)}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                          {req.items.map((item, i) => (
                            <Chip key={i} label={`${item.name} × ${item.quantity}`} size="small" variant="outlined" />
                          ))}
                        </Stack>
                        {req.generalNote && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            Note: {req.generalNote}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <StatusChip status={req.status} />
                      </Box>
                    </Box>
                    {req.status === 'Rejected' && req.rejectionReason && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'error.50', borderRadius: 1, border: '1px solid', borderColor: 'error.200' }}>
                        <Typography variant="subtitle2" color="error.800" fontWeight={600} sx={{ mb: 0.5 }}>Reason for Rejection:</Typography>
                        <Typography variant="body2" color="error.900">{req.rejectionReason}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}