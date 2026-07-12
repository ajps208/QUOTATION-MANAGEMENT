'use client';

import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/common/PageHeader';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { customerService } from '@/services/customerService';
import { USER_ROLES } from '@/constants/roles';

export default function CustomerQuotationRequestsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const requests = await customerService.getQuotationRequests();
        setItems(requests);
      } catch (err) {
        setError(err.message || 'Unable to load requests');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
      <Box>
        <PageHeader title="Quotation Requests" subtitle="Create requests, track status, and monitor quote progress." actionLabel="New Request" actionIcon={<AddCircle />} />
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error ? (
          items.length === 0 ? <EmptyState title="No requests yet" description="Your new quotation requests will appear here for review and updates." /> : (
            <Grid container spacing={2}>
              {items.map((item) => (
                <Grid xs={12} md={6} key={item.id}>
                  <Card>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6">{item.id}</Typography>
                          <Chip label={item.status} color="secondary" size="small" />
                        </Stack>
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
