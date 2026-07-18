'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Card, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationService } from '@/services/quotationService';
import { customerService } from '@/services/customerService';
import PageHeader from '@/components/common/PageHeader';
import AppTable from '@/components/common/AppTable';
import AppSearch from '@/components/common/AppSearch';
import AppFilter from '@/components/common/AppFilter';
import AppPagination from '@/components/common/AppPagination';
import StatusChip from '@/components/common/StatusChip';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { ErrorState } from '@/components/common/ErrorState';
import { TableLoader } from '@/components/common/LoadingState';
import { useSnackbar } from '@/hooks/useSnackbar';
import { usePagination } from '@/hooks/usePagination';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';

function getGrandTotal(q) {
  try {
    return calculateQuotationTotals(q).grandTotal;
  } catch {
    return 0;
  }
}

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Amount (Low-High)', value: 'amount_asc' },
  { label: 'Amount (High-Low)', value: 'amount_desc' },
];

export default function BusinessQuotationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.businessId) return;
    setLoading(true);
    setError(null);
    try {
      const [quots, custList] = await Promise.all([
        quotationService.getQuotationsByBusiness(user.businessId),
        customerService.getCustomers(user.businessId),
      ]);
      setQuotations(quots);
      const custMap = {};
      custList.forEach(c => custMap[c.id] = c);
      setCustomers(custMap);
    } catch (err) {
      setError(err);
      showError('Failed to load quotations');
    } finally {
      setLoading(false);
    }
  }, [user?.businessId, showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await quotationService.deleteQuotation(deleteConfirm.id);
      setQuotations(prev => prev.filter(q => q.id !== deleteConfirm.id));
      showSuccess('Quotation deleted');
    } catch (err) {
      showError('Failed to delete quotation');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const filteredQuotations = useMemo(() => {
    let result = quotations.filter(q => {
      const matchSearch = q.quotationNumber.toLowerCase().includes(search.toLowerCase()) ||
        customers[q.customerId]?.name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === '' || q.status === statusFilter;
      return matchSearch && matchStatus;
    });

    if (sortBy) {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
          case 'amount_asc': return getGrandTotal(a) - getGrandTotal(b);
          case 'amount_desc': return getGrandTotal(b) - getGrandTotal(a);
          default: return 0;
        }
      });
    } else {
      result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [quotations, search, statusFilter, sortBy, customers]);

  const { page, rowsPerPage, totalCount, paginatedData, handleChangePage, handleChangeRowsPerPage, setData } = usePagination([]);

  useEffect(() => {
    setData(filteredQuotations);
  }, [filteredQuotations, setData]);

  const statusOptions = Object.values(QUOTATION_STATUS).map(s => ({ label: s, value: s }));

  const columns = [
    { field: 'quotationNumber', label: 'Quotation #', sortable: true },
    {
      field: 'customerId',
      label: 'Customer',
      hideOnMobile: true,
      sortable: true,
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {customers[row.customerId]?.name || row.customerId}
        </Typography>
      ),
    },
    {
      field: 'quotationDate',
      label: 'Date',
      hideOnMobile: true,
      sortable: true,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">{formatDate(row.quotationDate)}</Typography>
      ),
    },
    {
      field: 'grandTotal',
      label: 'Amount',
      align: 'right',
      sortable: true,
      render: (row) => (
        <Typography variant="body2" fontWeight={600} color="primary.main">
          {formatCurrency(getGrandTotal(row))}
        </Typography>
      ),
    },
    {
      field: 'status',
      label: 'Status',
      align: 'center',
      sortable: true,
      render: (row) => <StatusChip status={row.status} revision={row.revision} />,
    },
    {
      field: 'actions',
      label: '',
      align: 'right',
      width: 160,
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
          <Tooltip title="View">
            <Button
              size="small"
              startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
              onClick={(e) => { e.stopPropagation(); router.push(`/business/quotations/${row.id}`); }}
              sx={{ fontSize: '0.8125rem' }}
            >
              View
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => { e.stopPropagation(); setDeleteConfirm(row); }}
              sx={{ ml: 0.5 }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    }
  ];

  const handleRefresh = () => {
    fetchData();
  };

  if (loading && quotations.length === 0) {
    return (
      <Box>
        <PageHeader
          title="Quotations"
          subtitle="Manage and send quotations to customers"
          actionLabel="New Quotation"
          actionIcon={<AddIcon />}
          onAction={() => router.push('/business/quotations/new')}
        />
        <TableLoader columns={columns.length} rows={10} showToolbar={true} />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Quotations"
        subtitle="Manage and send quotations to customers"
        actionLabel="New Quotation"
        actionIcon={<AddIcon />}
        onAction={() => router.push('/business/quotations/new')}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <AppSearch value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by number or customer..." />
        <AppFilter label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} />
        <AppFilter label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={SORT_OPTIONS} />
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading} size="small" sx={{ color: loading ? 'text.disabled' : 'text.secondary' }}>
              <RefreshIcon fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>

      {error && !loading && (
        <ErrorState
          error={error}
          onRetry={handleRefresh}
          variant="card"
          size="md"
          retryLabel="Retry"
        />
      )}

      <Card sx={{ overflow: 'hidden' }}>
        <AppTable
          columns={columns}
          data={paginatedData}
          loading={loading}
          error={error}
          onRetry={handleRefresh}
          onRowClick={(row) => router.push(`/business/quotations/${row.id}`)}
          emptyState={
            <EmptyState
              type="quotations"
              variant="card"
              size="md"
              actionLabel="Create Quotation"
              onAction={() => router.push('/business/quotations/new')}
            />
          }
          sortable
          sortModel={sortBy ? { [sortBy.split('_')[0]]: sortBy.includes('desc') ? 'desc' : 'asc' } : null}
          onSort={(model) => {
            const field = Object.keys(model)[0];
            const direction = model[field];
            setSortBy(`${field}_${direction}`);
          }}
        />
      </Card>

      <AppPagination
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {deleteConfirm && (
        <ConfirmDialog
          open={!!deleteConfirm}
          title="Delete Quotation"
          message={`Are you sure you want to permanently delete ${deleteConfirm.quotationNumber}? This action cannot be undone.`}
          confirmLabel="Delete"
          confirmColor="error"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
          dangerMode
        />
      )}
    </Box>
  );
}