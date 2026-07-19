'use client';

import { useEffect, useState, useCallback } from 'react';
import { Box, Card, CardContent, Chip, Grid, Stack, Typography, Tooltip, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/common/PageHeader';
import LoadingState from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import StatusChip from '@/components/common/StatusChip';
import { useAuthStore } from '@/store/useAuthStore';
import { businessService } from '@/services/businessService';
import { customerService } from '@/services/customerService';
import { USER_ROLES } from '@/constants/roles';
import { formatDate } from '@/utils/formatters';

export default function QuotationRequestsPage() {
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [customerMap, setCustomerMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    if (!user?.businessId) return;
    setLoading(true);
    setError('');
    try {
      const [requests, customers] = await Promise.all([
        businessService.getQuotationRequests(user.businessId),
        customerService.getCustomers(user.businessId).catch(() => []),
      ]);
      setItems(requests);
      const cMap = {};
      (Array.isArray(customers) ? customers : []).forEach(c => { cMap[c.id] = c; });
      setCustomerMap(cMap);
    } catch (err) {
      setError(err.message || 'Unable to load quotation requests');
    } finally {
      setLoading(false);
    }
  }, [user?.businessId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getCustomerDisplay = (req) => {
    if (req.customerInfo?.name) return req.customerInfo.name;
    const customer = customerMap[req.customerId] || customerMap[req.resolvedCustomerId];
    if (customer) return customer.name;
    return 'Unknown Customer';
  };

  const getRequestTitle = (req) => {
    const customerName = getCustomerDisplay(req);
    return `Request from ${customerName}`;
  };

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.BUSINESS]}>
      <Box>
        <PageHeader
          title="Quotation Requests"
          subtitle="Review incoming customer requests and convert them into quotations."
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
          items.length === 0 ? <EmptyState title="No requests yet" description="Incoming customer requests will appear here once submitted." /> : (
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
                        {item.customerInfo?.company && (
                          <Typography color="text.secondary">Company: {item.customerInfo.company}</Typography>
                        )}
                        <Typography color="text.secondary">
                          Customer: <strong>{getCustomerDisplay(item)}</strong>
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
                          Received: {formatDate(item.requestDate || item.createdAt)}
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
