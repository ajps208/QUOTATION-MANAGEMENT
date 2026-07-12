'use client';
import { useEffect, useState } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Avatar,
  List, ListItem, ListItemAvatar, ListItemText, Chip, Button, Divider
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationService } from '@/services/quotationService';
import { quotationRequestService } from '@/services/quotationRequestService';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import PageHeader from '@/components/common/PageHeader';
import { QUOTATION_STATUS, REQUEST_STATUS } from '@/constants/statuses';

const activityItems = [
  { title: 'Quotation #QT-1024 Accepted', time: '2 hours ago', color: '#16a34a', bg: '#dcfce7', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
  { title: 'New Request from Acme Corp', time: '5 hours ago', color: '#ca8a04', bg: '#fef9c3', icon: <NotificationsActiveIcon sx={{ fontSize: 16 }} /> },
  { title: 'Quotation #QT-1025 Sent', time: '1 day ago', color: '#2563eb', bg: '#dbeafe', icon: <SendIcon sx={{ fontSize: 16 }} /> },
  { title: 'Payment received for #QT-1020', time: '2 days ago', color: '#4f46e5', bg: '#ede9fe', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
];

export default function BusinessDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    pendingRequests: 0,
    activeQuotations: 0,
    acceptedQuotations: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.businessId) return;
      try {
        const [requests, quotations] = await Promise.all([
          quotationRequestService.getRequestsByBusiness(user.businessId),
          quotationService.getQuotationsByBusiness(user.businessId),
        ]);

        const pendingRequests = requests.filter(
          r => r.status === REQUEST_STATUS.SUBMITTED || r.status === REQUEST_STATUS.UNDER_REVIEW
        ).length;
        const activeQuotations = quotations.filter(
          q => q.status === QUOTATION_STATUS.SENT || q.status === QUOTATION_STATUS.VIEWED
        ).length;
        const accepted = quotations.filter(q => q.status === QUOTATION_STATUS.ACCEPTED);
        const acceptedQuotations = accepted.length;
        const totalRevenue = accepted.reduce((sum, q) => sum + (q.grandTotal || 0), 0);

        setStats({ pendingRequests, activeQuotations, acceptedQuotations, totalRevenue });

        setChartData([
          { name: 'Jan', revenue: 40000 },
          { name: 'Feb', revenue: 30000 },
          { name: 'Mar', revenue: 60000 },
          { name: 'Apr', revenue: totalRevenue > 0 ? totalRevenue : 80000 },
          { name: 'May', revenue: 55000 },
          { name: 'Jun', revenue: 72000 },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (!user) return null;

  // Get first name only
  const firstName = user.name?.split(' ')[0] || user.name;

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{ letterSpacing: '-0.01em', color: 'text.primary', lineHeight: 1.2 }}
        >
          Good morning, {firstName} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Here&apos;s what&apos;s happening with your business today.
        </Typography>
        <Divider sx={{ mt: 4 }} />
      </Box>

      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid xs={12} sm={6} lg={3}>
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={<DescriptionIcon />}
            color="warning"
            subtitle="Awaiting your response"
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <StatCard
            title="Active Quotations"
            value={stats.activeQuotations}
            icon={<ReceiptIcon />}
            color="info"
            subtitle="Sent to customers"
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <StatCard
            title="Accepted Quotations"
            value={stats.acceptedQuotations}
            icon={<CheckCircleIcon />}
            color="success"
            subtitle="Successfully closed"
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<TrendingUpIcon />}
            color="primary"
            subtitle="From accepted quotations"
          />
        </Grid>
      </Grid>

      {/* Chart + Activity Row */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid xs={12} lg={8}>
          <RevenueChart data={chartData} />
        </Grid>

        {/* Recent Activity */}
        <Grid xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: '28px !important', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Recent Activity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Latest events on your account
                </Typography>
              </Box>

              <List disablePadding sx={{ flex: 1 }}>
                {activityItems.map((activity, idx) => (
                  <ListItem
                    key={idx}
                    disableGutters
                    alignItems="flex-start"
                    sx={{
                      py: 1.5,
                      borderBottom: idx < activityItems.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 44 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: activity.bg,
                          color: activity.color,
                        }}
                      >
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ lineHeight: 1.4 }}>
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 0, color: 'primary.main', fontWeight: 600 }}
                >
                  View all activity
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
