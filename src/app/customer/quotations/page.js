'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationService } from '@/services/quotationService';
import { businessService } from '@/services/businessService';
import PageHeader from '@/components/common/PageHeader';
import AppTable from '@/components/common/AppTable';
import AppSearch from '@/components/common/AppSearch';
import AppFilter from '@/components/common/AppFilter';
import StatusChip from '@/components/common/StatusChip';
import EmptyState from '@/components/common/EmptyState';
import { useSnackbar } from '@/hooks/useSnackbar';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function CustomerQuotationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showError } = useSnackbar();

  const [quotations, setQuotations] = useState([]);
  const [businesses, setBusinesses] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const [quots, bizList] = await Promise.all([
          quotationService.getQuotationsByCustomer(user.id),
          businessService.getBusinesses(),
        ]);
        setQuotations(quots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        const bizMap = {};
        bizList.forEach(b => bizMap[b.id] = b);
        setBusinesses(bizMap);
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
      businesses[q.businessId]?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === '' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusOptions = Object.values(QUOTATION_STATUS).map(s => ({ label: s, value: s }));

  const columns = [
    { field: 'quotationNumber', label: 'Quotation #' },
    {
      field: 'businessId',
      label: 'From',
      render: (row) => businesses[row.businessId]?.name || row.businessId,
    },
    {
      field: 'quotationDate',
      label: 'Date',
      render: (row) => formatDate(row.quotationDate),
    },
    {
      field: 'expiryDate',
      label: 'Valid Until',
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
          onClick={() => router.push(`/customer/quotations/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="My Quotations"
        subtitle="Review quotations received from vendors"
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <AppSearch value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by number or vendor..." />
        <AppFilter label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} />
      </Box>

      <AppTable
        columns={columns}
        data={filtered}
        emptyState={
          <EmptyState
            title="No quotations received yet"
            description="Submit a quotation request to a vendor and they will send you a quotation."
          />
        }
      />
    </Box>
  );
}
