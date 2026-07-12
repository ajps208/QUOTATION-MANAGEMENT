'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Button, Chip, Grid, Card, CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationService } from '@/services/quotationService';
import { customerService } from '@/services/customerService';
import PageHeader from '@/components/common/PageHeader';
import AppTable from '@/components/common/AppTable';
import AppSearch from '@/components/common/AppSearch';
import AppFilter from '@/components/common/AppFilter';
import StatusChip from '@/components/common/StatusChip';
import EmptyState from '@/components/common/EmptyState';
import { useSnackbar } from '@/hooks/useSnackbar';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function BusinessQuotationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showError } = useSnackbar();

  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.businessId) return;
      try {
        const [quots, custList] = await Promise.all([
          quotationService.getQuotationsByBusiness(user.businessId),
          customerService.getCustomers(user.businessId),
        ]);
        setQuotations(quots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        const custMap = {};
        custList.forEach(c => custMap[c.id] = c);
        setCustomers(custMap);
      } catch (err) {
        showError('Failed to load quotations');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const filtered = quotations.filter(q => {
    const matchSearch = q.quotationNumber.toLowerCase().includes(search.toLowerCase()) ||
      customers[q.customerId]?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === '' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusOptions = Object.values(QUOTATION_STATUS).map(s => ({ label: s, value: s }));

  const columns = [
    { field: 'quotationNumber', label: 'Quotation #' },
    {
      field: 'customerId',
      label: 'Customer',
      render: (row) => customers[row.customerId]?.name || row.customerId,
    },
    {
      field: 'quotationDate',
      label: 'Date',
      render: (row) => formatDate(row.quotationDate),
    },
    {
      field: 'expiryDate',
      label: 'Expires',
      render: (row) => formatDate(row.expiryDate),
    },
    {
      field: 'grandTotal',
      label: 'Amount',
      align: 'right',
      render: (row) => (
        <Typography variant="body2" fontWeight={700} color="primary.main">
          {formatCurrency(row.grandTotal)}
        </Typography>
      ),
    },
    {
      field: 'status',
      label: 'Status',
      align: 'center',
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      field: 'actions',
      label: '',
      align: 'right',
      render: (row) => (
        <Button
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => router.push(`/business/quotations/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Quotations"
        subtitle="Manage and send quotations to customers"
        actionLabel="New Quotation"
        actionIcon={<AddIcon />}
        onAction={() => router.push('/business/quotations/new')}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <AppSearch value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by number or customer..." />
        <AppFilter label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} />
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        <AppTable
          columns={columns}
          data={filtered}
          emptyState={
            <EmptyState
              title="No quotations found"
              description={search || statusFilter ? 'Try adjusting your filters.' : 'Create your first quotation to send to a customer.'}
            />
          }
        />
      </Card>
    </Box>
  );
}
