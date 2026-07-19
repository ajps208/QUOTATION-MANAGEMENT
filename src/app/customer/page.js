'use client';
import { useEffect, useState, useCallback } from 'react';
import { Box, Grid, Typography, Card, CardContent, Button } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StoreIcon from '@mui/icons-material/Store';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationService } from '@/services/quotationService';
import { businessService } from '@/services/businessService';
import PageHeader from '@/components/common/PageHeader';
import { QUOTATION_STATUS } from '@/constants/statuses';

export default function CustomerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [stats, setStats] = useState({
    activeQuotations: 0,
    acceptedQuotations: 0,
    vendors: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [quotations, businesses] = await Promise.all([
        quotationService.getQuotationsByUser(user.id),
        businessService.getBusinesses(),
      ]);

      const active = quotations.filter(q => 
        [QUOTATION_STATUS.SENT, QUOTATION_STATUS.VIEWED, QUOTATION_STATUS.REVISED].includes(q.status)
      ).length;
      
      const accepted = quotations.filter(q => q.status === QUOTATION_STATUS.ACCEPTED).length;

      const uniqueVendors = new Set(quotations.map(q => q.businessId)).size;

      setStats({
        activeQuotations: active,
        acceptedQuotations: accepted,
        vendors: uniqueVendors || 1,
      });

    } catch (error) {
      console.error("Failed to fetch customer dashboard data:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (!user) return null;

  return (
    <Box>
      <PageHeader 
        title={`Welcome, ${user.name}`} 
        subtitle="Manage your requested quotations and interact with vendors."
      />

      <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 3, md: 6 } }}>
        <Grid xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(31,107,71,0.08)', color: '#1F6B47' }}>
                <DescriptionIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>{stats.activeQuotations}</Typography>
                <Typography variant="body2" color="text.secondary">Active Quotations</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(31,107,71,0.08)', color: '#1F6B47' }}>
                <CheckCircleIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>{stats.acceptedQuotations}</Typography>
                <Typography variant="body2" color="text.secondary">Accepted Quotations</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(95,107,98,0.08)', color: '#5F6B62' }}>
                <StoreIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>{stats.vendors}</Typography>
                <Typography variant="body2" color="text.secondary">Connected Vendors</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={600} mb={1}>Need a new quotation?</Typography>
          <Typography variant="body2" color="text.secondary"sx={{ mt: 2 }} >
            Browse vendors and submit a request to get custom pricing for the products and services you need.
          </Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => router.push('/customer/vendors')}>
            Browse Vendors
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
