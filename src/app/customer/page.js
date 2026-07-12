'use client';
import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Divider, Button } from '@mui/material';
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      try {
        const [quotations, businesses] = await Promise.all([
          quotationService.getQuotationsByCustomer(user.id),
          businessService.getBusinesses(), // For a real app, only fetch connected vendors
        ]);

        const active = quotations.filter(q => 
          [QUOTATION_STATUS.SENT, QUOTATION_STATUS.VIEWED, QUOTATION_STATUS.REVISED].includes(q.status)
        ).length;
        
        const accepted = quotations.filter(q => q.status === QUOTATION_STATUS.ACCEPTED).length;

        // Unique business IDs from quotations
        const uniqueVendors = new Set(quotations.map(q => q.businessId)).size;

        setStats({
          activeQuotations: active,
          acceptedQuotations: accepted,
          vendors: uniqueVendors || 1, // Just to show some mock data if empty
        });

      } catch (error) {
        console.error("Failed to fetch customer dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) return null;

  return (
    <Box>
      <PageHeader 
        title={`Welcome, ${user.name}`} 
        subtitle="Manage your requested quotations and interact with vendors."
      />

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.dark' }}>
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
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'success.light', color: 'success.dark' }}>
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
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'info.light', color: 'info.dark' }}>
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

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={600} mb={1}>Need a new quotation?</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Browse vendors and submit a request to get custom pricing for the products and services you need.
          </Typography>
          <Button variant="contained" onClick={() => router.push('/customer/vendors')}>
            Browse Vendors
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
