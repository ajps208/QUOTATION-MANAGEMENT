'use client';

import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/common/PageHeader';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { customerService } from '@/services/customerService';
import { USER_ROLES } from '@/constants/roles';

export default function BusinessesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const businesses = await customerService.getBusinesses();
        setItems(businesses);
      } catch (err) {
        setError(err.message || 'Unable to load businesses');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
      <Box>
        <PageHeader title="Browse Businesses" subtitle="Discover active service providers and request quotations directly from their catalog." />
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error ? (
          items.length === 0 ? <EmptyState title="No businesses found" description="Active businesses will appear here for your browsing and requesting flow." /> : (
            <Grid container spacing={2}>
              {items.map((item) => (
                <Grid xs={12} md={6} key={item.id}>
                  <Card>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6">{item.name}</Typography>
                          <Chip label={item.status} color="success" size="small" />
                        </Stack>
                        <Typography color="text.secondary">{item.description}</Typography>
                        <Typography color="text.secondary">Type: {item.type}</Typography>
                        <Typography color="text.secondary">Industry: {item.industry}</Typography>
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
