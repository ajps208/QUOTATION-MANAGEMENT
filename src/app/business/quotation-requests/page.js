'use client';

import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/common/PageHeader';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { businessService } from '@/services/businessService';
import { USER_ROLES } from '@/constants/roles';

export default function QuotationRequestsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const requests = await businessService.getQuotationRequests();
        setItems(requests);
      } catch (err) {
        setError(err.message || 'Unable to load quotation requests');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.BUSINESS]}>
      <Box>
        <PageHeader title="Quotation Requests" subtitle="Review incoming customer requests and convert them into quotations." />
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error ? (
          items.length === 0 ? <EmptyState title="No requests yet" description="Incoming customer requests will appear here once submitted." /> : (
            <Grid container spacing={2}>
              {items.map((item) => (
                <Grid item xs={12} md={6} key={item.id}>
                  <Card>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6">{item.id}</Typography>
                          <Chip label={item.status} color="primary" size="small" />
                        </Stack>
                        <Typography color="text.secondary">Customer: {item.customer}</Typography>
                        <Typography color="text.secondary">Business: {item.business}</Typography>
                        <Typography color="text.secondary">Requested products: {item.items.length}</Typography>
                        <Typography color="text.secondary">General note: {item.generalNote}</Typography>
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
