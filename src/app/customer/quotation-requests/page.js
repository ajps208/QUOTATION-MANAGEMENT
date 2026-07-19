'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, CardContent, Chip, Grid, Stack, Typography, Tooltip, IconButton } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/common/PageHeader';
import LoadingState from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import StatusChip from '@/components/common/StatusChip';
import { useAuthStore } from '@/store/useAuthStore';
import { customerService } from '@/services/customerService';
import { businessService } from '@/services/businessService';
import { USER_ROLES } from '@/constants/roles';
import { formatDate } from '@/utils/formatters';

export default function CustomerQuotationRequestsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [businessMap, setBusinessMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const [requests, businesses] = await Promise.all([
        customerService.getQuotationRequests(user.id),
        businessService.getBusinesses().catch(() => []),
      ]);
      setItems(requests);
      const bizMap = {};
      (Array.isArray(businesses) ? businesses : []).forEach(b => { bizMap[b.id] = b; });
      setBusinessMap(bizMap);
    } catch (err) {
      setError(err.message || 'Unable to load requests');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getBusinessDisplay = (req) => {
    const biz = businessMap[req.businessId];
    if (biz) return biz.name || biz.profile?.businessName || 'Unknown Vendor';
    return 'Unknown Vendor';
  };

  const getRequestTitle = (req) => {
    const firstItem = req.items?.[0];
    if (firstItem) return firstItem.name;
    return `Request to ${getBusinessDisplay(req)}`;
  };

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
      <Box>
        <PageHeader
          title="Quotation Requests"
          subtitle="Create requests, track status, and monitor quote progress."
          actionLabel="New Request"
          actionIcon={<AddCircle />}
          onAction={() => router.push('/customer/vendors')}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={loadData} disabled={loading} size="small" sx={{ color: loading ? 'text.disabled' : 'text.secondary' }}>
              <RefreshIcon fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
        </Box>
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error ? (
          items.length === 0 ? <EmptyState title="No requests yet" description="Your new quotation requests will appear here for review and updates." /> : (
            <Grid container spacing={2}>
              {items.map((item) => (
                <Grid xs={12} md={6} key={item.id}>
                  <Card sx={{ '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" fontWeight={700}>
                            {getRequestTitle(item)}
                          </Typography>
                          <StatusChip status={item.status} />
                        </Stack>
                        <Typography color="text.secondary">
                          Vendor: <strong>{getBusinessDisplay(item)}</strong>
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          {item.items.map((prodItem, i) => (
                            <Chip key={i} label={`${prodItem.name} × ${prodItem.quantity}`} size="small" variant="outlined" />
                          ))}
                        </Stack>
                        {item.generalNote && (
                          <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>
                            Note: {item.generalNote}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Submitted: {formatDate(item.requestDate || item.createdAt)}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )
        ) : null}
      </Box>
    </ProtectedRoute>
  );
}
