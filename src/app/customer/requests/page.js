'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, IconButton, Tooltip, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Stack, ToggleButton, ToggleButtonGroup, TableSortLabel,
  Select, MenuItem, FormControl, Divider, Fade, useMediaQuery, useTheme,
  CircularProgress, Button,
} from '@mui/material';
import {
  Search as SearchIcon, Refresh as RefreshIcon, FilterList as FilterListIcon,
  ViewModule as GridIcon, ViewList as TableIcon, Receipt as ReceiptIcon,
  Visibility as VisibilityIcon, DeleteOutlined as DeleteIcon,
  FirstPage as FirstPageIcon, LastPage as LastPageIcon,
  ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
  Download as DownloadIcon, Clear as ClearIcon,
} from '@mui/icons-material';

import { useAuthStore } from '@/store/useAuthStore';
import { quotationRequestService } from '@/services/quotationRequestService';
import { businessService } from '@/services/businessService';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import EmptyState from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/formatters';
import RequestCard from './components/RequestCard';
import RequestFilters from './components/RequestFilters';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import AppDialog from '@/components/common/AppDialog';

const DEFAULT_SORT = 'createdAt:desc';
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function CustomerRequestsPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [requests, setRequests] = useState([]);
  const [businesses, setBusinesses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [viewMode, setViewMode] = useState(isMobile ? 'grid' : 'table');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    businessId: '',
    sortBy: DEFAULT_SORT,
    pageSize: 10,
    page: 0,
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [detailTarget, setDetailTarget] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [reqs, bizList] = await Promise.all([
        quotationRequestService.getRequestsByCustomer(user.id),
        businessService.getBusinesses(),
      ]);
      setRequests(reqs);
      const bizMap = {};
      bizList.forEach(b => { bizMap[b.id] = b; });
      setBusinesses(bizMap);
    } catch (err) {
      setError(err);
      showError('Failed to load your requests');
    } finally {
      setLoading(false);
    }
  }, [user, showError]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, [fetchData]);

  const getBusinessName = useCallback((businessId) => {
    const biz = businesses[businessId];
    return biz?.name || biz?.profile?.businessName || null;
  }, [businesses]);

  const filteredAndSorted = useMemo(() => {
    let result = [...requests];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(req => {
        const bizName = getBusinessName(req.businessId) || '';
        const itemNames = req.items?.map(i => i.name).join(' ') || '';
        return (
          req.id?.toLowerCase().includes(q) ||
          itemNames.toLowerCase().includes(q) ||
          bizName.toLowerCase().includes(q) ||
          req.status?.toLowerCase().includes(q) ||
          req.generalNote?.toLowerCase().includes(q)
        );
      });
    }

    if (filters.status) {
      result = result.filter(req => req.status === filters.status);
    }
    if (filters.businessId) {
      result = result.filter(req => req.businessId === filters.businessId);
    }

    const [sortField, sortDir] = (filters.sortBy || DEFAULT_SORT).split(':');
    result.sort((a, b) => {
      let valA, valB;
      switch (sortField) {
        case 'createdAt':
          valA = new Date(a.createdAt || a.requestDate || 0);
          valB = new Date(b.createdAt || b.requestDate || 0);
          break;
        case 'updatedAt':
          valA = new Date(a.updatedAt || 0);
          valB = new Date(b.updatedAt || 0);
          break;
        case 'status':
          valA = (a.status || '').toLowerCase();
          valB = (b.status || '').toLowerCase();
          return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        default:
          valA = new Date(a.createdAt || a.requestDate || 0);
          valB = new Date(b.createdAt || b.requestDate || 0);
      }
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [requests, debouncedSearch, filters, getBusinessName]);

  const totalPages = Math.ceil(filteredAndSorted.length / filters.pageSize);
  const clampedPage = totalPages > 0 ? Math.min(filters.page, totalPages - 1) : 0;
  const paginatedData = useMemo(() => {
    const start = clampedPage * filters.pageSize;
    return filteredAndSorted.slice(start, start + filters.pageSize);
  }, [filteredAndSorted, clampedPage, filters.pageSize]);

  const businessOptions = useMemo(() => {
    const ids = [...new Set(requests.map(r => r.businessId).filter(Boolean))];
    return ids.map(id => ({ id, name: getBusinessName(id) || id })).sort((a, b) => a.name.localeCompare(b.name));
  }, [requests, getBusinessName]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ status: '', businessId: '', sortBy: DEFAULT_SORT, pageSize: 10, page: 0 });
    setSearchQuery('');
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await quotationRequestService.deleteRequest(deleteTarget.id);
      setRequests(prev => prev.filter(r => r.id !== deleteTarget.id));
      showSuccess('Request deleted successfully');
      setDeleteTarget(null);
    } catch {
      showError('Failed to delete request');
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, showSuccess, showError]);

  const handleExportCSV = useCallback(() => {
    const headers = ['Request ID', 'Items', 'Business', 'Status', 'Created', 'Updated', 'Note'];
    const rows = filteredAndSorted.map(req => [
      req.id,
      req.items?.map(i => `${i.name} x${i.quantity}`).join('; ') || '',
      getBusinessName(req.businessId) || '',
      req.status || '',
      formatDate(req.createdAt || req.requestDate),
      formatDate(req.updatedAt),
      (req.generalNote || '').replace(/,/g, ';'),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `requests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('CSV exported successfully');
  }, [filteredAndSorted, getBusinessName, showSuccess]);

  const activeFilterCount = [filters.status, filters.businessId].filter(Boolean).length;

  const columns = [
    { id: 'id', label: 'Request ID', sortable: true, sx: { minWidth: 120 } },
    { id: 'subject', label: 'Subject', sortable: false, sx: { minWidth: 180 } },
    { id: 'business', label: 'Business', sortable: true, sx: { minWidth: 140 } },
    { id: 'items', label: 'Items', sortable: false, sx: { minWidth: 160 } },
    { id: 'status', label: 'Status', sortable: true, sx: { minWidth: 120 } },
    { id: 'created', label: 'Created', sortable: true, sx: { minWidth: 110 } },
    { id: 'updated', label: 'Updated', sortable: true, sx: { minWidth: 110 } },
    { id: 'actions', label: '', sortable: false, sx: { minWidth: 80, width: 80 } },
  ];

  const handleTableSort = (field) => {
    const fieldMap = { id: 'createdAt', business: 'createdAt', created: 'createdAt', updated: 'updatedAt', status: 'status' };
    const mapped = fieldMap[field] || field;
    const [currentField, currentDir] = (filters.sortBy || DEFAULT_SORT).split(':');
    let newDir = 'desc';
    if (currentField === mapped && currentDir === 'desc') newDir = 'asc';
    setFilters(prev => ({ ...prev, sortBy: `${mapped}:${newDir}`, page: 0 }));
  };

  const currentSortField = (filters.sortBy || DEFAULT_SORT).split(':')[0];
  const currentSortDir = (filters.sortBy || DEFAULT_SORT).split(':')[1];

  const renderToolbar = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 1.5 },
        flexWrap: 'wrap',
        py: 2,
        px: { xs: 0, sm: 0 },
      }}
    >
      <TextField
        size="small"
        placeholder="Search requests..."
        value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value); setFilters(prev => ({ ...prev, page: 0 })); }}
        sx={{
          flex: { xs: '1 1 100%', sm: '1 1 280px' },
          minWidth: { xs: '100%', sm: 220 },
          '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'background.paper' },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => { setSearchQuery(''); setFilters(prev => ({ ...prev, page: 0 })); }} sx={{ color: 'text.secondary' }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { sm: 'auto' } }}>
        <Tooltip title="Filters">
          <IconButton
            onClick={() => setFilterOpen(true)}
            sx={{
              color: activeFilterCount > 0 ? 'primary.main' : 'text.secondary',
              bgcolor: activeFilterCount > 0 ? 'primary.50' : 'transparent',
              border: '1px solid',
              borderColor: activeFilterCount > 0 ? 'primary.200' : 'divider',
              borderRadius: 2,
              width: 36,
              height: 36,
            }}
          >
            <BadgeWrapper count={activeFilterCount}>
              <FilterListIcon fontSize="small" />
            </BadgeWrapper>
          </IconButton>
        </Tooltip>

        {!isMobile && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, v) => v && setViewMode(v)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: 1.25,
                py: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px !important',
                color: 'text.secondary',
                '&.Mui-selected': { bgcolor: 'primary.50', color: 'primary.main', borderColor: 'primary.200' },
                '&:hover': { bgcolor: 'grey.50' },
              },
              '& .MuiToggleButtonGroup-firstChild': { mr: 0.75 },
            }}
          >
            <ToggleButton value="table"><TableIcon fontSize="small" /></ToggleButton>
            <ToggleButton value="grid"><GridIcon fontSize="small" /></ToggleButton>
          </ToggleButtonGroup>
        )}

        <Tooltip title="Export CSV">
          <IconButton
            onClick={handleExportCSV}
            disabled={filteredAndSorted.length === 0}
            sx={{
              color: 'text.secondary', border: '1px solid', borderColor: 'divider',
              borderRadius: 2, width: 36, height: 36,
              '&:hover': { bgcolor: 'grey.50' },
            }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Refresh">
          <IconButton
            onClick={fetchData}
            disabled={loading}
            sx={{
              color: 'text.secondary', border: '1px solid', borderColor: 'divider',
              borderRadius: 2, width: 36, height: 36,
              '&:hover': { bgcolor: 'grey.50' },
            }}
          >
            <RefreshIcon fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const renderPagination = () => {
    if (filteredAndSorted.length === 0) return null;
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          mt: 2,
          px: 0.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
            Showing {filteredAndSorted.length > 0 ? clampedPage * filters.pageSize + 1 : 0}
            &ndash;
            {Math.min((clampedPage + 1) * filters.pageSize, filteredAndSorted.length)}
            {' '}of{' '}{filteredAndSorted.length} requests
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 70 }}>
            <Select
              value={filters.pageSize}
              onChange={(e) => setFilters(prev => ({ ...prev, pageSize: parseInt(e.target.value), page: 0 }))}
              sx={{ borderRadius: 2, fontSize: '0.8125rem', height: 32 }}
              variant="outlined"
            >
              {PAGE_SIZE_OPTIONS.map(n => (
                <MenuItem key={n} value={n}>{n}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton
            size="small"
            onClick={() => setFilters(prev => ({ ...prev, page: 0 }))}
            disabled={clampedPage === 0}
            sx={{ color: clampedPage === 0 ? 'text.disabled' : 'text.secondary' }}
          >
            <FirstPageIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
            disabled={clampedPage === 0}
            sx={{ color: clampedPage === 0 ? 'text.disabled' : 'text.secondary' }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {generatePageNumbers(clampedPage, totalPages).map((p, i) =>
              p === '...' ? (
                <Typography key={`e-${i}`} variant="body2" color="text.disabled" sx={{ px: 0.5, fontSize: '0.8125rem' }}>
                  ...
                </Typography>
              ) : (
                <IconButton
                  key={p}
                  size="small"
                  onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                  sx={{
                    width: 30,
                    height: 30,
                    fontSize: '0.8125rem',
                    fontWeight: p === clampedPage ? 700 : 500,
                    color: p === clampedPage ? 'primary.main' : 'text.secondary',
                    bgcolor: p === clampedPage ? 'primary.50' : 'transparent',
                    border: p === clampedPage ? '1px solid' : '1px solid transparent',
                    borderColor: p === clampedPage ? 'primary.200' : 'transparent',
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: p === clampedPage ? 'primary.100' : 'grey.50' },
                  }}
                >
                  {p + 1}
                </IconButton>
              )
            )}
          </Box>

          <IconButton
            size="small"
            onClick={() => setFilters(prev => ({ ...prev, page: Math.min(totalPages - 1, prev.page + 1) }))}
            disabled={clampedPage >= totalPages - 1}
            sx={{ color: clampedPage >= totalPages - 1 ? 'text.disabled' : 'text.secondary' }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setFilters(prev => ({ ...prev, page: totalPages - 1 }))}
            disabled={clampedPage >= totalPages - 1}
            sx={{ color: clampedPage >= totalPages - 1 ? 'text.disabled' : 'text.secondary' }}
          >
            <LastPageIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  };

  const renderTableView = () => (
    <Fade in timeout={300}>
      <Box>
        <TableContainer
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflowX: 'auto',
            bgcolor: 'background.paper',
          }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  <TableCell
                    key={col.id}
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'text.secondary',
                      borderBottom: '2px solid',
                      borderColor: 'divider',
                      bgcolor: '#FAFAFA',
                      whiteSpace: 'nowrap',
                      py: 1.5,
                      ...(col.sx || {}),
                    }}
                    align={col.id === 'actions' ? 'right' : 'left'}
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={currentSortField === col.id || (col.id === 'business' && currentSortField === 'createdAt')}
                        direction={currentSortDir}
                        onClick={() => handleTableSort(col.id)}
                        sx={{ '& .MuiTableSortLabel-icon': { fontSize: 16 } }}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((req, idx) => {
                const subject = req.items?.[0]?.name || 'Quotation Request';
                const extraItems = (req.items?.length || 0) - 1;
                return (
                  <TableRow
                    key={req.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      '&:last-child td': { borderBottom: 'none' },
                    }}
                    onClick={() => setDetailTarget(req)}
                  >
                    <TableCell sx={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '0.8125rem', py: 1.5 }}>
                      #{req.id?.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 220 }}>
                        {subject}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 160 }}>
                        {getBusinessName(req.businessId) || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {req.items?.slice(0, 2).map((item, i) => (
                          <Chip
                            key={i}
                            label={`${item.name} ×${item.quantity}`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 22, fontSize: '0.675rem', borderColor: 'divider', '& .MuiChip-label': { px: 0.75 } }}
                          />
                        ))}
                        {extraItems > 0 && (
                          <Chip
                            label={`+${extraItems}`}
                            size="small"
                            sx={{ height: 22, fontSize: '0.675rem', bgcolor: 'grey.100', color: 'text.secondary', '& .MuiChip-label': { px: 0.75 } }}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}><StatusChip status={req.status} /></TableCell>
                    <TableCell sx={{ py: 1.5, whiteSpace: 'nowrap', color: 'text.secondary', fontSize: '0.8125rem' }}>
                      {formatDate(req.createdAt || req.requestDate)}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, whiteSpace: 'nowrap', color: 'text.secondary', fontSize: '0.8125rem' }}>
                      {formatDate(req.updatedAt)}
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      <Stack direction="row" spacing={0} sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); setDetailTarget(req); }}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {(req.status === 'Draft' || req.status === 'Changes Requested') && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={(e) => { e.stopPropagation(); setDeleteTarget(req); }}
                              sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'error.50' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fade>
  );

  const renderGridView = () => (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        {paginatedData.map((req, idx) => (
          <RequestCard
            key={req.id}
            request={req}
            businessName={getBusinessName(req.businessId)}
            onView={setDetailTarget}
            onDelete={setDeleteTarget}
            index={idx}
          />
        ))}
      </Box>
    </Fade>
  );

  const renderRequestDetail = () => {
    if (!detailTarget) return null;
    const req = detailTarget;
    return (
      <AppDialog
        open={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        title={`Request #${req.id?.slice(-8).toUpperCase()}`}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <StatusChip status={req.status} />
            <Typography variant="caption" color="text.secondary">
              Created {formatDate(req.createdAt || req.requestDate)}
              {req.updatedAt && req.updatedAt !== req.createdAt && ` · Updated ${formatDate(req.updatedAt)}`}
            </Typography>
          </Box>

          <DetailRow label="Business / Vendor">
            <Typography variant="body2" fontWeight={500}>
              {getBusinessName(req.businessId) || req.businessId}
            </Typography>
          </DetailRow>

          <DetailRow label="Items">
            <Stack spacing={1}>
              {req.items?.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Chip label={`Qty: ${item.quantity}`} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                </Box>
              ))}
            </Stack>
          </DetailRow>

          {req.generalNote && (
            <DetailRow label="Note">
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                &ldquo;{req.generalNote}&rdquo;
              </Typography>
            </DetailRow>
          )}

          {req.status === 'Rejected' && req.rejectionReason && (
            <Box sx={{ p: 2, bgcolor: 'error.50', borderRadius: 2, border: '1px solid', borderColor: 'error.200' }}>
              <Typography variant="subtitle2" color="error.800" fontWeight={600} sx={{ mb: 0.5 }}>
                Rejection Reason
              </Typography>
              <Typography variant="body2" color="error.700">{req.rejectionReason}</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1, pt: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => setDetailTarget(null)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.secondary' }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </AppDialog>
    );
  };

  if (loading && requests.length === 0) {
    return (
      <Box>
        <PageHeader
          title="My Requests"
          subtitle="Track and manage your quotation requests"
          actionLabel="Browse Vendors"
          actionIcon={<ReceiptIcon />}
          onAction={() => router.push('/customer/vendors')}
        />
        <SkeletonLoader />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="My Requests"
        subtitle="Track and manage your quotation requests"
        actionLabel="Browse Vendors"
        actionIcon={<ReceiptIcon />}
        onAction={() => router.push('/customer/vendors')}
      />

      {error && !loading && (
        <ErrorState error={error} onRetry={fetchData} variant="card" size="md" retryLabel="Retry" />
      )}

      {!error && (
        <>
          {renderToolbar()}

          {(filters.status || filters.businessId || searchQuery) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Active filters:
              </Typography>
              {searchQuery && (
                <Chip
                  label={`Search: "${searchQuery}"`}
                  size="small"
                  onDelete={() => setSearchQuery('')}
                  sx={{ borderRadius: 2, height: 24, fontSize: '0.7rem', fontWeight: 500 }}
                />
              )}
              {filters.status && (
                <Chip
                  label={`Status: ${filters.status}`}
                  size="small"
                  onDelete={() => setFilters(prev => ({ ...prev, status: '', page: 0 }))}
                  sx={{ borderRadius: 2, height: 24, fontSize: '0.7rem', fontWeight: 500 }}
                />
              )}
              {filters.businessId && (
                <Chip
                  label={`Vendor: ${getBusinessName(filters.businessId)}`}
                  size="small"
                  onDelete={() => setFilters(prev => ({ ...prev, businessId: '', page: 0 }))}
                  sx={{ borderRadius: 2, height: 24, fontSize: '0.7rem', fontWeight: 500 }}
                />
              )}
              <Button
                size="small"
                onClick={handleClearFilters}
                sx={{ textTransform: 'none', fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary', ml: 0.5 }}
              >
                Clear all
              </Button>
            </Box>
          )}

          {!loading && filteredAndSorted.length === 0 && requests.length === 0 && (
            <EmptyState
              type="requests"
              title="No requests yet"
              description="You have not submitted any quotation requests. Browse vendors to get started."
              actionLabel="Browse Vendors"
              onAction={() => router.push('/customer/vendors')}
              variant="page"
              size="lg"
            />
          )}

          {!loading && filteredAndSorted.length === 0 && requests.length > 0 && (
            <EmptyState
              type="search"
              title="No matching requests"
              description="Try adjusting your search or filters to find what you're looking for."
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
              variant="page"
              size="md"
            />
          )}

          {loading && requests.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={28} color="primary" />
            </Box>
          )}

          {!loading && filteredAndSorted.length > 0 && (
            <>
              {viewMode === 'table' ? renderTableView() : renderGridView()}
              {renderPagination()}
            </>
          )}
        </>
      )}

      <RequestFilters
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={(f) => { handleFilterChange({ ...f, page: 0 }); }}
        onClear={handleClearFilters}
        businessOptions={businessOptions}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Request"
        message={`Are you sure you want to delete request #${deleteTarget?.id?.slice(-8).toUpperCase()}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={deleting}
      />

      {renderRequestDetail()}
    </Box>
  );
}

function DetailRow({ label, children }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.6875rem', mb: 0.75, display: 'block' }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

function BadgeWrapper({ count, children }) {
  if (!count) return children;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      <Box
        sx={{
          position: 'absolute',
          top: -5,
          right: -5,
          width: 16,
          height: 16,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: 'white',
          fontSize: '0.6rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        {count}
      </Box>
    </Box>
  );
}

function generatePageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages = [];
  if (current <= 3) {
    for (let i = 0; i < 5; i++) pages.push(i);
    pages.push('...');
    pages.push(total - 1);
  } else if (current >= total - 4) {
    pages.push(0);
    pages.push('...');
    for (let i = total - 5; i < total; i++) pages.push(i);
  } else {
    pages.push(0);
    pages.push('...');
    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
    pages.push('...');
    pages.push(total - 1);
  }
  return pages;
}

function SkeletonLoader() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ height: 48, borderRadius: 2, bgcolor: 'grey.100', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              height: 180,
              borderRadius: 3,
              bgcolor: 'grey.100',
              animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
              '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
