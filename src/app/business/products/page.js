'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, IconButton, Chip, Card, Grid, Typography, Tooltip, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridViewIcon from '@mui/icons-material/GridView';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useAuthStore } from '@/store/useAuthStore';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { TableLoader } from '@/components/common/LoadingState';
import PageHeader from '@/components/common/PageHeader';
import AppTable from '@/components/common/AppTable';
import AppSearch from '@/components/common/AppSearch';
import AppFilter from '@/components/common/AppFilter';
import AppPagination from '@/components/common/AppPagination';
import EmptyState from '@/components/common/EmptyState';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { LoadingState, SkeletonLoader } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { SaveButton, DeleteButton } from '@/components/common/AppButton';
import { useSnackbar } from '@/hooks/useSnackbar';
import { usePagination } from '@/hooks/usePagination';
import ProductDialog from './components/ProductDialog';
import { formatCurrency } from '@/utils/formatters';

const SORT_OPTIONS = [
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' },
  { label: 'Price (Low-High)', value: 'price_asc' },
  { label: 'Price (High-Low)', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const TYPE_OPTIONS = [
  { label: 'Product', value: 'product' },
  { label: 'Service', value: 'service' },
];

export default function ProductsPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState('table');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.businessId) return;
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(user.businessId),
        categoryService.getCategories(user.businessId),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err);
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [user?.businessId, showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter) {
      result = result.filter(p => p.status === statusFilter);
    }

    if (typeFilter) {
      result = result.filter(p => p.type === typeFilter);
    }

    if (sortBy) {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'name_asc': return a.name.localeCompare(b.name);
          case 'name_desc': return b.name.localeCompare(a.name);
          case 'price_asc': return (a.basePrice || 0) - (b.basePrice || 0);
          case 'price_desc': return (b.basePrice || 0) - (a.basePrice || 0);
          case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
          default: return 0;
        }
      });
    }

    return result;
  }, [products, search, statusFilter, typeFilter, sortBy]);

  const { page, rowsPerPage, totalCount, paginatedData, handleChangePage, handleChangeRowsPerPage, setData } = usePagination([]);

  useEffect(() => {
    setData(filteredProducts);
  }, [filteredProducts, setData]);

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await productService.deleteProduct(productToDelete.id);
      showSuccess('Product deleted successfully');
      fetchData();
    } catch (err) {
      showError('Failed to delete product');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, formData);
        showSuccess('Product updated successfully');
      } else {
        await productService.createProduct({ ...formData, businessId: user.businessId });
        showSuccess('Product created successfully');
      }
      fetchData();
      setDialogOpen(false);
    } catch (err) {
      showError('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (product) => {
    try {
      await fetch(`/api/products/${product.id}/duplicate`, { method: 'POST' });
      showSuccess('Product duplicated successfully');
      fetchData();
    } catch (err) {
      showError('Failed to duplicate product');
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const columns = [
    { field: 'name', label: 'Product Name', sortable: true },
    { field: 'sku', label: 'SKU', hideOnMobile: true, sortable: true },
    { 
      field: 'categoryId', 
      label: ' Category',
      hideOnMobile: true,
      render: (row) => getCategoryName(row.categoryId)
    },
    { 
      field: 'type', 
      label: 'Type',
      hideOnMobile: true,
      sortable: true,
      render: (row) => <Chip label={row.type} size="small" variant="outlined" />
    },
    { 
      field: 'basePrice', 
      label: 'Price',
      align: 'right',
      sortable: true,
      render: (row) => formatCurrency(row.basePrice)
    },
    { 
      field: 'discount', 
      label: 'Discount',
      align: 'center',
      hideOnMobile: true,
      render: (row) => row.discount > 0 ? `${row.discount}%` : '-'
    },
    { 
      field: 'status', 
      label: 'Status',
      align: 'center',
      sortable: true,
      render: (row) => <StatusChip status={row.status} />
    },
    {
      field: 'actions',
      label: 'Actions',
      align: 'right',
      width: 160,
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
          <Tooltip title="Duplicate">
            <IconButton onClick={(e) => { e.stopPropagation(); handleDuplicate(row); }} size="small" color="inherit" disabled={deleting || saving}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(row); }} size="small" color="primary" disabled={deleting || saving}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }} size="small" color="error" disabled={deleting || saving}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  if (loading && products.length === 0) {
    return (
      <Box>
        <PageHeader 
          title="Products & Services" 
          subtitle="Manage your catalog items for quotations"
          actionLabel="Add Item"
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
        title="Products & Services" 
        subtitle="Manage your catalog items for quotations"
        actionLabel="Add Item"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <AppSearch 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search by name or SKU..."
        />
        <AppFilter label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={STATUS_OPTIONS} />
        <AppFilter label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={TYPE_OPTIONS} />
        <AppFilter label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={SORT_OPTIONS} />
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading} size="small" sx={{ color: loading ? 'text.disabled' : 'text.secondary' }}>
              <RefreshIcon fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
          <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Tooltip title="Table View">
              <IconButton size="small" onClick={() => setViewMode('table')} sx={{ borderRadius: 0, px: 1, color: viewMode === 'table' ? 'primary.main' : 'text.secondary' }}>
                <TableRowsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Grid View">
              <IconButton size="small" onClick={() => setViewMode('grid')} sx={{ borderRadius: 0, px: 1, color: viewMode === 'grid' ? 'primary.main' : 'text.secondary' }}>
                <GridViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
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

      {viewMode === 'table' ? (
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
                type="products"
                variant="card"
                size="md"
                actionLabel="Add Product"
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
      ) : (
        paginatedData.length === 0 ? (
          <EmptyState 
            type="products"
            variant="card"
            size="md"
            actionLabel="Add Product"
            onAction={handleAdd}
          />
        ) : (
          <Grid container spacing={2}>
            {paginatedData.map((product) => (
              <Grid xs={12} sm={6} md={4} key={product.id}>
                <Card
                  onClick={() => handleEdit(product)}
                  sx={{ p: 2.5, cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' }, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1, minWidth: 0 }}>
                      {product.name}
                    </Typography>
                    <StatusChip status={product.status} />
                  </Box>
                  {product.sku && (
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                      SKU: {product.sku}
                    </Typography>
                  )}
                  <Chip label={product.type} size="small" variant="outlined" sx={{ alignSelf: 'flex-start', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {getCategoryName(product.categoryId)}
                  </Typography>
                  <Box sx={{ mt: 'auto', pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                      {formatCurrency(product.basePrice)}
                      {product.discount > 0 && (
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                          (-{product.discount}%)
                        </Typography>
                      )}
                    </Typography>
                    <Box onClick={(e) => e.stopPropagation()}>
                      <IconButton onClick={() => handleDuplicate(product)} size="small" color="inherit" disabled={deleting || saving}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleEdit(product)} size="small" color="primary" disabled={deleting || saving}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(product)} size="small" color="error" disabled={deleting || saving}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      )}

      <AppPagination
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {dialogOpen && (
        <ProductDialog 
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          product={selectedProduct}
          categories={categories}
          loading={saving}
        />
      )}

      <ConfirmDialog 
        open={confirmOpen}
        title="Delete Item"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        dangerMode
      />
    </Box>
  );
}