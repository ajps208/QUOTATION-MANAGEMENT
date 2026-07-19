'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, IconButton, Card, Tooltip, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useAuthStore } from '@/store/useAuthStore';
import { customerService } from '@/services/customerService';
import PageHeader from '@/components/common/PageHeader';
import AppTable from '@/components/common/AppTable';
import AppSearch from '@/components/common/AppSearch';
import AppFilter from '@/components/common/AppFilter';
import AppPagination from '@/components/common/AppPagination';
import EmptyState from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { TableLoader } from '@/components/common/LoadingState';
import { useSnackbar } from '@/hooks/useSnackbar';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import CustomerDialog from './components/CustomerDialog';

const SORT_OPTIONS = [
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
];

export default function CustomersPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [sortBy, setSortBy] = useState('');
  const [error, setError] = useState(null);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomers = useCallback(async () => {
    if (!user?.businessId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getCustomers(user.businessId);
      setCustomers(data);
    } catch (err) {
      setError(err);
      showError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, [user, showError]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    let result = customers.filter(c => 
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.companyName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    if (sortBy) {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'name_asc': return a.name.localeCompare(b.name);
          case 'name_desc': return b.name.localeCompare(a.name);
          case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
          default: return 0;
        }
      });
    }

    return result;
  }, [customers, debouncedSearch, sortBy]);

  const { page, rowsPerPage, totalCount, paginatedData, handleChangePage, handleChangeRowsPerPage, setData } = usePagination([]);

  useEffect(() => {
    setData(filteredCustomers);
  }, [filteredCustomers, setData]);

  const handleAdd = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    setDeleting(true);
    try {
      await customerService.deleteCustomer(customerToDelete.id);
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
      showSuccess('Customer deleted successfully');
    } catch (err) {
      showError('Failed to delete customer');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (selectedCustomer) {
        const updated = await customerService.updateCustomer(selectedCustomer.id, formData);
        setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? updated : c));
        showSuccess('Customer updated successfully');
      } else {
        const created = await customerService.createCustomer({ ...formData, businessId: user.businessId });
        setCustomers(prev => [created, ...prev]);
        showSuccess('Customer created successfully');
      }
      setDialogOpen(false);
    } catch (err) {
      showError('Failed to save customer');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { field: 'name', label: 'Contact Name', sortable: true },
    { field: 'companyName', label: 'Company', hideOnMobile: true, sortable: true },
    { field: 'email', label: 'Email', hideOnMobile: true, sortable: true },
    { field: 'phone', label: 'Phone', sortable: true },
    { field: 'city', label: 'City', hideOnMobile: true },
    {
      field: 'status',
      label: 'Status',
      align: 'center',
      sortable: true,
      render: (row) => <StatusChip status={row.status || 'Active'} />
    },
    {
      field: 'actions',
      label: 'Actions',
      align: 'right',
      width: 120,
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(row); }} size="small" color="primary" disabled={deleting || saving}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }} size="small" color="error" disabled={deleting || saving}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const handleRefresh = () => {
    fetchCustomers();
  };

  if (loading && customers.length === 0) {
    return (
      <Box>
        <PageHeader 
          title="Customers" 
          subtitle="Manage your client database"
          actionLabel="Add Customer"
          actionIcon={<AddIcon />}
          onAction={handleAdd}
        />
        <TableLoader columns={columns.length} rows={10} showToolbar={true} />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="Customers" 
        subtitle="Manage your client database"
        actionLabel="Add Customer"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <AppSearch 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search by name, company or email..."
        />
        <AppFilter label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={SORT_OPTIONS} />
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
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
          onRowClick={(row) => handleEdit(row)}
          emptyState={
            <EmptyState 
              type="customers"
              variant="card"
              size="md"
              actionLabel="Add Customer"
              onAction={handleAdd}
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

      {dialogOpen && (
        <CustomerDialog 
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          customer={selectedCustomer}
          loading={saving}
        />
      )}

      <ConfirmDialog 
        open={confirmOpen}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        dangerMode
      />
    </Box>
  );
}