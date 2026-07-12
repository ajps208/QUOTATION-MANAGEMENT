'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Chip, Button, Card, CardContent, Grid } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationRequestService } from '@/services/quotationRequestService';
import { businessService } from '@/services/businessService';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import EmptyState from '@/components/common/EmptyState';
import { useSnackbar } from '@/hooks/useSnackbar';
import { formatDate } from '@/utils/formatters';

export default function CustomerRequestsPage() {
  const { user } = useAuthStore();
  const { showError } = useSnackbar();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [businesses, setBusinesses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
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
        showError('Failed to load your requests');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <Typography sx={{ mt: 4 }}>Loading your requests...</Typography>;

  return (
    <Box>
      <PageHeader
        title="My Requests"
        subtitle="Track the status of quotation requests you have submitted"
        actionLabel="Browse Vendors"
        actionIcon={<ReceiptIcon />}
        onAction={() => router.push('/customer/vendors')}
      />

      {requests.length === 0 ? (
        <EmptyState
          title="No requests found"
          description="You have not submitted any quotation requests yet. Browse vendors to get started."
        />
      ) : (
        <Grid container spacing={3}>
          {requests.map((req) => {
            const vendor = businesses[req.businessId];
            return (
              <Grid item xs={12} key={req.id}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>{req.id}</Typography>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          To: <strong>{vendor?.name || req.businessId}</strong> • {formatDate(req.requestDate)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {req.items.map((item, i) => (
                            <Chip key={i} label={`${item.name} × ${item.quantity}`} size="small" variant="outlined" />
                          ))}
                        </Box>
                        {req.generalNote && (
                          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                            Note: {req.generalNote}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <StatusChip status={req.status} />
                      </Box>
                    </Box>
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
