'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Card, Stack, Tooltip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationService } from '@/services/quotationService';
import { businessService } from '@/services/businessService';
import PageHeader from '@/components/common/PageHeader';
import AppTable from '@/components/common/AppTable';
import AppSearch from '@/components/common/AppSearch';
import AppFilter from '@/components/common/AppFilter';
import StatusChip from '@/components/common/StatusChip';
import EmptyState from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { TableLoader } from '@/components/common/LoadingState';
import { useSnackbar } from '@/hooks/useSnackbar';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';

const VIEWABLE_STATUSES = [QUOTATION_STATUS.SENT];

function getViewTooltip(status) {
  switch (status) {
    case QUOTATION_STATUS.DRAFT:
      return 'This quotation has not been sent yet.';
    case QUOTATION_STATUS.VIEWED:
    case QUOTATION_STATUS.ACCEPTED:
    case QUOTATION_STATUS.REJECTED:
    case QUOTATION_STATUS.EXPIRED:
    case QUOTATION_STATUS.CANCELLED:
    case QUOTATION_STATUS.CHANGES_REQUESTED:
    case QUOTATION_STATUS.REVISED:
      return 'Quotation details can only be viewed when the status is Sent.';
    default:
      return 'View quotation details';
  }
}

export default function CustomerQuotationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showError } = useSnackbar();

  const [quotations, setQuotations] = useState([]);
  const [businesses, setBusinesses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [quots, bizList] = await Promise.all([
        quotationService.getQuotationsByUser(user.id),
        businessService.getBusinesses(),
      ]);
      setQuotations(quots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      const bizMap = {};
      bizList.forEach(b => bizMap[b.id] = b);
      setBusinesses(bizMap);
    } catch (err) {
      setError(err);
      showError('Failed to load quotations');
    } finally {
      setLoading(false);
    }
  }, [user?.id, showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    return quotations.filter(q => {
      const matchSearch = q.quotationNumber.toLowerCase().includes(search.toLowerCase()) ||
        businesses[q.businessId]?.name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === '' || q.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [quotations, search, statusFilter, businesses]);

  const statusOptions = useMemo(() =>
    Object.values(QUOTATION_STATUS).map(s => ({ label: s, value: s }))
  , []);

  const isViewable = (status) => VIEWABLE_STATUSES.includes(status);
  

  const columns = [
    { field: 'quotationNumber', label: 'Quotation #' },
   {
  field: 'businessId',
  label: 'From',
  hideOnMobile: true,
  render: (row) => {
    return businesses[row.businessId]?.profile?.businessName || 'Unknown Vendor';
  },
},
    {
      field: 'quotationDate',
      label: 'Issue Date',
      hideOnMobile: true,
      render: (row) => formatDate(row.quotationDate),
    },
    {
      field: 'expiryDate',
      label: 'Expiry Date',
      hideOnMobile: true,
      render: (row) => formatDate(row.expiryDate),
    },
    {
      field: 'grandTotal',
      label: 'Amount',
      align: 'right',
      render: (row) => {
        const totals = calculateQuotationTotals(row);
        return (
          <Typography variant="body2" fontWeight={700} color="primary.main">
            {formatCurrency(totals.grandTotal)}
          </Typography>
        );
      },
    },
    {
      field: 'status',
      label: 'Status',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <StatusChip status={row.status} />
          {row.status === QUOTATION_STATUS.REJECTED && row.rejectionReason && (
            <Tooltip title={row.rejectionReason} arrow placement="top">
              <Typography
                variant="caption"
                color="error.main"
                sx={{ cursor: 'help', textDecoration: 'underline dotted', lineHeight: 1.2, textAlign: 'center', maxWidth: 120 }}
              >
                View reason
              </Typography>
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: 'actions',
      label: '',
      align: 'right',
      width: 120,
      render: (row) => (
        <Tooltip title={getViewTooltip(row.status)}>
          <span>
            <Button
              size="small"
              startIcon={<VisibilityIcon />}
              disabled={!isViewable(row.status)}
              onClick={(e) => {
                e.stopPropagation();
                if (isViewable(row.status)) {
                  router.push(`/customer/quotations/${row.id}`);
                }
              }}
              sx={{ minWidth: 80 }}
            >
              View
            </Button>
          </span>
        </Tooltip>
      ),
    },
  ];

  const handleRefresh = () => {
    fetchData();
  };

  if (loading && quotations.length === 0) {
    return (
      <Box>
        <PageHeader
          title="My Quotations"
          subtitle="Review quotations received from vendors"
        />
        <TableLoader columns={7} rows={10} showToolbar={true} />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="My Quotations"
        subtitle="Review quotations received from vendors"
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <AppSearch value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by number or vendor..." />
        <AppFilter label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} />
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
          data={filtered}
          loading={loading}
          error={error}
          onRetry={handleRefresh}
          onRowClick={(row) => {
            if (isViewable(row.status)) {
              router.push(`/customer/quotations/${row.id}`);
            }
          }}
          emptyState={
            <EmptyState
              title="No quotations received yet"
              description="Submit a quotation request to a vendor and they will send you a quotation."
            />
          }
        />
      </Card>
    </Box>
  );
}