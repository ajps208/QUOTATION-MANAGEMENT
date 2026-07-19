'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Card, IconButton, Avatar, Stack, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useAuthStore } from '@/store/useAuthStore';
import { categoryService } from '@/services/categoryService';
import PageHeader from '@/components/common/PageHeader';
import AppTable from '@/components/common/AppTable';
import AppSearch from '@/components/common/AppSearch';
import AppFilter from '@/components/common/AppFilter';
import AppPagination from '@/components/common/AppPagination';
import EmptyState from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { TableLoader } from '@/components/common/LoadingState';
import StatusChip from '@/components/common/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { usePagination } from '@/hooks/usePagination';
import CategoryDialog from './components/CategoryDialog';
import { formatDate } from '@/utils/formatters';

const SORT_OPTIONS = [
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export default function CategoriesPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    if (!user?.businessId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories(user.businessId);
      setCategories(data);
    } catch (err) {
      setError(err);
      showError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [user?.businessId, showError]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    let result = categories.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter) {
      result = result.filter(c => c.status === statusFilter);
    }

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
  }, [categories, search, statusFilter, sortBy]);

  const { page, rowsPerPage, totalCount, paginatedData, handleChangePage, handleChangeRowsPerPage, setData } = usePagination([]);

  useEffect(() => {
    setData(filteredCategories);
  }, [filteredCategories, setData]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      showSuccess('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      showError('Failed to delete category');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory.id, formData);
        showSuccess('Category updated successfully');
      } else {
        await categoryService.createCategory({ ...formData, businessId: user.businessId });
        showSuccess('Category created successfully');
      }
      fetchCategories();
      setDialogOpen(false);
    } catch (err) {
      showError('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      field: 'image',
      label: '',
      width: 48,
      sortable: false,
      render: (row) => (
        <Avatar
          src={row.image || undefined}
          variant="rounded"
          sx={{ width: 36, height: 36, bgcolor: 'grey.100', color: 'grey.500' }}
        >
          {row.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      ),
    },
    { field: 'name', label: 'Name', sortable: true },
    { field: 'description', label: 'Description', hideOnMobile: true },
    { 
      field: 'status', 
      label: 'Status',
      align: 'center',
      sortable: true,
      render: (row) => <StatusChip status={row.status} />
    },
    { 
      field: 'createdAt', 
      label: 'Created',
      hideOnMobile: true,
      sortable: true,
      render: (row) => formatDate(row.createdAt)
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
    fetchCategories();
  };

  if (loading && categories.length === 0) {
    return (
      <Box>
        <PageHeader 
          title="Categories" 
          subtitle="Manage product and service categories"
          actionLabel="Add Category"
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
        title="Categories" 
        subtitle="Manage product and service categories"
        actionLabel="Add Category"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <AppSearch 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search categories..."
        />
        <AppFilter label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={STATUS_OPTIONS} />
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
          onRowClick={(row) => handleEdit(row)}
          emptyState={
            <EmptyState
              type="categories"
              variant="card"
              size="md"
              actionLabel="Add Category"
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
        <CategoryDialog 
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          category={selectedCategory}
          loading={saving}
        />
      )}

      <ConfirmDialog 
        open={confirmOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        dangerMode
      />
    </Box>
  );
}