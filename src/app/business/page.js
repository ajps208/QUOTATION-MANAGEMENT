'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Box, Stack, Typography, Button, Card, CardContent, Skeleton } from '@mui/material';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import RefreshIcon from '@mui/icons-material/RefreshRounded';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationService } from '@/services/quotationService';
import { quotationRequestService } from '@/services/quotationRequestService';
import { productService } from '@/services/productService';
import { customerService } from '@/services/customerService';
import { QUOTATION_STATUS, REQUEST_STATUS } from '@/constants/statuses';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';
import { useSnackbar } from '@/hooks/useSnackbar';

import DashboardHeader from './components/DashboardHeader';
import KpiCard from './components/KpiCard';
import QuickActions from './components/QuickActions';
import RecentQuotations from './components/RecentQuotations';
import RecentActivity from './components/RecentActivity';
import { ErrorState } from '@/components/common/ErrorState';

const RevenueChart = dynamic(() => import('./components/RevenueChart'), { loading: () => <ChartPlaceholder title="Revenue Overview" />, ssr: false });
const QuotationsChart = dynamic(() => import('./components/QuotationsChart'), { loading: () => <ChartPlaceholder title="Monthly Quotations" />, ssr: false });
const StatusDistribution = dynamic(() => import('./components/StatusDistribution'), { loading: () => <ChartPlaceholder title="Quotation Status" />, ssr: false });

function ChartPlaceholder({ title }) {
  return (
    <Box sx={{ p: 3, height: 300 }}>
      <SkeletonChartCard title={title} />
    </Box>
  );
}

function SkeletonChartCard({ title }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '0.9375rem', fontWeight: 600, mb: 2 }}>{title}</Typography>
        <Skeleton variant="rounded" height={260} sx={{ borderRadius: 3 }} />
      </CardContent>
    </Card>
  );
}

function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const startTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 1000);
  };
  return { isTransitioning, startTransition };
}

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
    result.push({ name: MONTHS[d.getMonth()], revenue: monthly[key] || 0 });
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
    result.push({ name: MONTHS[d.getMonth()], count: monthly[key] || 0 });
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
    if (q.status === QUOTATION_STATUS.ACCEPTED) { type = 'accepted'; title = `Quotation ${q.quotationNumber || ''} accepted`; }
    else if (q.status === QUOTATION_STATUS.SENT) { type = 'sent'; title = `Quotation ${q.quotationNumber || ''} sent`; }
    else if (q.status === QUOTATION_STATUS.REJECTED) { type = 'updated'; title = `Quotation ${q.quotationNumber || ''} rejected`; }
    activities.push({ title, time: q.updatedAt || q.createdAt, type });
  });
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 4);
  recentRequests.forEach((r) => {
    let type = 'request';
    let title = `New request from ${r.customerName || 'customer'}`;
    if (r.status === REQUEST_STATUS.APPROVED) { type = 'accepted'; title = `Request ${r.requestNumber || ''} approved`; }
    activities.push({ title, time: r.updatedAt || r.createdAt, type });
  });
  return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
}

function DashboardSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Skeleton variant="text" width="30%" height={32} />
        <Skeleton variant="text" width="20%" height={20} sx={{ mt: 1 }} />
      </Box>
      <Stack direction="column" spacing={3}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: { xs: 1.5, sm: 2 } }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} sx={{ height: 120 }}>
              <CardContent><Skeleton variant="text" width="40%" height={24} /><Skeleton variant="text" width="60%" height={32} sx={{ mt: 1 }} /></CardContent>
            </Card>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
          <Card sx={{ height: 320 }}><CardContent><Skeleton variant="text" width="30%" height={20} /><Skeleton variant="rounded" height={260} sx={{ mt: 2 }} /></CardContent></Card>
          <Card sx={{ height: 320 }}><CardContent><Skeleton variant="text" width="30%" height={20} /><Skeleton variant="rounded" height={260} sx={{ mt: 2 }} /></CardContent></Card>
        </Box>
      </Stack>
    </Box>
  );
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
    const draftQuotations = quotations.filter((q) => q.status === QUOTATION_STATUS.DRAFT).length;
    const approvedQuotations = quotations.filter((q) => q.status === QUOTATION_STATUS.ACCEPTED).length;
    const totalRevenue = quotations.filter((q) => q.status === QUOTATION_STATUS.ACCEPTED).reduce((sum, q) => sum + getGrandTotal(q), 0);
    return { totalQuotations, draftQuotations, approvedQuotations, totalRevenue, totalCustomers: customers.length, totalProducts: products.length };
  }, [quotations, customers, products]);

  const chartData = useMemo(() => ({
    revenue: buildMonthlyRevenue(quotations),
    monthlyQuotations: buildMonthlyQuotations(quotations),
    statusDistribution: buildStatusDistribution(quotations),
  }), [quotations]);

  const recentQuotations = useMemo(() => {
    const customerMap = {};
    customers.forEach(c => { customerMap[c.id] = c; });
    return [...quotations]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5)
      .map(q => ({
        ...q,
        customerName: customerMap[q.customerId]?.name || 'Unknown Customer',
      }));
  }, [quotations, customers]);

  const activities = useMemo(() => buildActivities(quotations, requests), [quotations, requests]);

  if (!user) return null;

  if (loading && quotations.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
      <DashboardHeader userName={user.name} businessName={user.companyName || user.businessName} />

      {error && !loading && (
        <ErrorState error={error} onRetry={fetchDashboardData} variant="alert" size="md" title="Failed to Load Dashboard" description="Unable to fetch dashboard data. Please check your connection and try again." />
      )}

      <Stack direction="column" spacing={3}>
        <Stack direction="row" sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Overview</Typography>
          <Button variant="outlined" size="small" onClick={fetchDashboardData} disabled={loading} startIcon={<RefreshIcon fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />}>
            Refresh
          </Button>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: { xs: 1.5, sm: 2 } }}>
          <KpiCard title="Total Quotations" value={kpis.totalQuotations} icon={<DescriptionRoundedIcon />} color="primary" subtitle="All time quotations" loading={loading} />
          <KpiCard title="Draft Quotations" value={kpis.draftQuotations} icon={<ReceiptLongRoundedIcon />} color="warning" subtitle="Pending to send" loading={loading} />
          <KpiCard title="Approved" value={kpis.approvedQuotations} icon={<CheckCircleRoundedIcon />} color="success" subtitle="Successfully closed" loading={loading} />
          <KpiCard title="Revenue" value={`₹${kpis.totalRevenue.toLocaleString()}`} icon={<TrendingUpRoundedIcon />} color="info" subtitle="From accepted quotations" loading={loading} />
          <KpiCard title="Customers" value={kpis.totalCustomers} icon={<PeopleAltRoundedIcon />} color="secondary" subtitle="Total customers" loading={loading} />
          <KpiCard title="Products" value={kpis.totalProducts} icon={<Inventory2RoundedIcon />} color="error" subtitle="In your catalog" loading={loading} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: { xs: 2, md: 2.5 } }}>
          <RevenueChart data={chartData.revenue} loading={loading} />
          <QuotationsChart data={chartData.monthlyQuotations} loading={loading} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: { xs: 2, md: 2.5 } }}>
          <StatusDistribution data={chartData.statusDistribution} loading={loading} />
          <RecentActivity activities={activities} loading={loading} />
        </Box>

        <QuickActions />
        <RecentQuotations quotations={recentQuotations} loading={loading} />
      </Stack>
    </Box>
  );
}
