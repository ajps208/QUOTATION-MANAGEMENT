'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Grid, Stack, Typography, Button } from '@mui/material';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationService } from '@/services/quotationService';
import { quotationRequestService } from '@/services/quotationRequestService';
import { productService } from '@/services/productService';
import { customerService } from '@/services/customerService';
import { QUOTATION_STATUS, REQUEST_STATUS } from '@/constants/statuses';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';
import { useSnackbar } from '@/hooks/useSnackbar';
import RefreshIcon from '@mui/icons-material/RefreshRounded';

import DashboardHeader from './components/DashboardHeader';
import KpiCard from './components/KpiCard';
import RevenueChart from './components/RevenueChart';
import QuotationsChart from './components/QuotationsChart';
import StatusDistribution from './components/StatusDistribution';
import QuickActions from './components/QuickActions';
import RecentQuotations from './components/RecentQuotations';
import RecentActivity from './components/RecentActivity';
import { DashboardCardSkeleton, ChartSkeleton, LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getGrandTotal(q) {
  try {
    return calculateQuotationTotals(q).grandTotal;
  } catch {
    return 0;
  }
}

function buildMonthlyRevenue(quotations) {
  const now = new Date();
  const monthly = {};

  quotations.forEach((q) => {
    if (q.status === QUOTATION_STATUS.ACCEPTED && q.createdAt) {
      const d = new Date(q.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthly[key]) monthly[key] = 0;
      monthly[key] += getGrandTotal(q);
    }
  });

  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    result.push({
      name: MONTHS[d.getMonth()],
      revenue: monthly[key] || 0,
    });
  }
  return result;
}

function buildMonthlyQuotations(quotations) {
  const now = new Date();
  const monthly = {};

  quotations.forEach((q) => {
    if (q.createdAt) {
      const d = new Date(q.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthly[key]) monthly[key] = 0;
      monthly[key] += 1;
    }
  });

  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    result.push({
      name: MONTHS[d.getMonth()],
      count: monthly[key] || 0,
    });
  }
  return result;
}

function buildStatusDistribution(quotations) {
  const counts = {};
  quotations.forEach((q) => {
    const status = q.status || 'Draft';
    counts[status] = (counts[status] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function buildActivities(quotations, requests) {
  const activities = [];

  const recentQuotations = [...quotations]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 8);

  recentQuotations.forEach((q) => {
    let type = 'created';
    let title = `Quotation ${q.quotationNumber || ''} created`;

    if (q.status === QUOTATION_STATUS.ACCEPTED) {
      type = 'accepted';
      title = `Quotation ${q.quotationNumber || ''} accepted`;
    } else if (q.status === QUOTATION_STATUS.SENT) {
      type = 'sent';
      title = `Quotation ${q.quotationNumber || ''} sent`;
    } else if (q.status === QUOTATION_STATUS.REJECTED) {
      type = 'updated';
      title = `Quotation ${q.quotationNumber || ''} rejected`;
    }

    activities.push({
      title,
      time: q.updatedAt || q.createdAt,
      type,
    });
  });

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 4);

  recentRequests.forEach((r) => {
    let type = 'request';
    let title = `New request from ${r.customerName || 'customer'}`;

    if (r.status === REQUEST_STATUS.APPROVED) {
      type = 'accepted';
      title = `Request ${r.requestNumber || ''} approved`;
    }

    activities.push({
      title,
      time: r.updatedAt || r.createdAt,
      type,
    });
  });

  return activities
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10);
}

export default function BusinessDashboard() {
  const { user } = useAuthStore();
  const { showError } = useSnackbar();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.businessId) return;
    setLoading(true);
    setError(null);
    try {
      const [quotationsData, requestsData, productsData, customersData] =
        await Promise.all([
          quotationService.getQuotationsByBusiness(user.businessId).catch(() => []),
          quotationRequestService.getRequestsByBusiness(user.businessId).catch(() => []),
          productService.getProducts(user.businessId).catch(() => []),
          customerService.getCustomers(user.businessId).catch(() => []),
        ]);

      setQuotations(Array.isArray(quotationsData) ? quotationsData : []);
      setRequests(Array.isArray(requestsData) ? requestsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (err) {
      setError(err);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user?.businessId, showError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const kpis = useMemo(() => {
    const totalQuotations = quotations.length;
    const draftQuotations = quotations.filter(
      (q) => q.status === QUOTATION_STATUS.DRAFT
    ).length;
    const approvedQuotations = quotations.filter(
      (q) => q.status === QUOTATION_STATUS.ACCEPTED
    ).length;
    const totalRevenue = quotations
      .filter((q) => q.status === QUOTATION_STATUS.ACCEPTED)
      .reduce((sum, q) => sum + getGrandTotal(q), 0);
    const totalCustomers = customers.length;
    const totalProducts = products.length;

    return {
      totalQuotations,
      draftQuotations,
      approvedQuotations,
      totalRevenue,
      totalCustomers,
      totalProducts,
    };
  }, [quotations, customers, products]);

  const chartData = useMemo(() => ({
    revenue: buildMonthlyRevenue(quotations),
    monthlyQuotations: buildMonthlyQuotations(quotations),
    statusDistribution: buildStatusDistribution(quotations),
  }), [quotations]);

  const recentQuotations = useMemo(() => {
    return [...quotations]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5);
  }, [quotations]);

  const activities = useMemo(() => {
    return buildActivities(quotations, requests);
  }, [quotations, requests]);

  if (!user) return null;

  if (loading && quotations.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <LoadingState variant="page" title="Loading Dashboard" description="Fetching your business data..." />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
      <DashboardHeader
        userName={user.name}
        businessName={user.companyName || user.businessName}
      />

      {error && !loading && (
        <ErrorState
          error={error}
          onRetry={fetchDashboardData}
          variant="alert"
          size="md"
          title="Failed to Load Dashboard"
          description="Unable to fetch dashboard data. Please check your connection and try again."
        />
      )}

<Stack direction="column" spacing={3}>
        <Stack direction="row" sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Overview</Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={fetchDashboardData}
            disabled={loading}
            startIcon={<RefreshIcon fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />}
          >
            Refresh
          </Button>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(6, 1fr)',
            },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <KpiCard
            title="Total Quotations"
            value={kpis.totalQuotations}
            icon={<DescriptionRoundedIcon />}
            color="primary"
            subtitle="All time quotations"
            loading={loading}
          />
          <KpiCard
            title="Draft Quotations"
            value={kpis.draftQuotations}
            icon={<ReceiptLongRoundedIcon />}
            color="warning"
            subtitle="Pending to send"
            loading={loading}
          />
          <KpiCard
            title="Approved"
            value={kpis.approvedQuotations}
            icon={<CheckCircleRoundedIcon />}
            color="success"
            subtitle="Successfully closed"
            loading={loading}
          />
          <KpiCard
            title="Revenue"
            value={`₹${kpis.totalRevenue.toLocaleString()}`}
            icon={<TrendingUpRoundedIcon />}
            color="info"
            subtitle="From accepted quotations"
            loading={loading}
          />
          <KpiCard
            title="Customers"
            value={kpis.totalCustomers}
            icon={<PeopleAltRoundedIcon />}
            color="secondary"
            subtitle="Total customers"
            loading={loading}
          />
          <KpiCard
            title="Products"
            value={kpis.totalProducts}
            icon={<Inventory2RoundedIcon />}
            color="error"
            subtitle="In your catalog"
            loading={loading}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '1fr 1fr',
            },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          <RevenueChart data={chartData.revenue} loading={loading} />
          <QuotationsChart data={chartData.monthlyQuotations} loading={loading} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '1fr 1fr',
            },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          <StatusDistribution data={chartData.statusDistribution} loading={loading} />
          <RecentActivity activities={activities} loading={loading} />
        </Box>

        <QuickActions />

        <RecentQuotations quotations={recentQuotations} loading={loading} />
      </Stack>
    </Box>
  );
}