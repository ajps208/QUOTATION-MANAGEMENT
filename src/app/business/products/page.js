'use client';
import { useState, useEffect } from 'react';
import { Box, IconButton, Chip, Card } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAuthStore } from '@/store/useAuthStore';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import PageHeader from '@/components/common/PageHeader';
import AppTable from '@/components/common/AppTable';
import AppSearch from '@/components/common/AppSearch';
import EmptyState from '@/components/common/EmptyState';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useSnackbar } from '@/hooks/useSnackbar';
import ProductDialog from './components/ProductDialog';
import { formatCurrency } from '@/utils/formatters';

export default function ProductsPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchData = async () => {
    if (!user?.businessId) return;
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(user.businessId),
        categoryService.getCategories(user.businessId),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

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
    try {
      await productService.deleteProduct(productToDelete.id);
      showSuccess('Product deleted successfully');
      fetchData();
    } catch (error) {
      showError('Failed to delete product');
    } finally {
      setConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSave = async (formData) => {
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
    } catch (error) {
      showError('Failed to save product');
    }
  };

  const columns = [
    { field: 'name', label: 'Product Name' },
    { field: 'sku', label: 'SKU', hideOnMobile: true },
    { 
      field: 'categoryId', 
      label: 'Category',
      hideOnMobile: true,
      render: (row) => getCategoryName(row.categoryId)
    },
    { 
      field: 'type', 
      label: 'Type',
      hideOnMobile: true,
      render: (row) => <Chip label={row.type} size="small" variant="outlined" />
    },
    { 
      field: 'basePrice', 
      label: 'Price',
      align: 'right',
      render: (row) => formatCurrency(row.basePrice)
    },
    { 
      field: 'status', 
      label: 'Status',
      align: 'center',
      render: (row) => <StatusChip status={row.status} />
    },
    {
      field: 'actions',
      label: 'Actions',
      align: 'right',
      width: 120,
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(row); }} size="small" color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }} size="small" color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <PageHeader 
        title="Products & Services" 
        subtitle="Manage your catalog items for quotations"
        actionLabel="Add Item"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <Box sx={{ mb: 4 }}>
        <AppSearch 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search by name or SKU..."
        />
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        <AppTable 
          columns={columns}
          data={filteredProducts}
          onRowClick={(row) => handleEdit(row)}
          emptyState={
            <EmptyState 
              title="No products found" 
              description={search ? 'Try adjusting your search query' : 'Create your first product or service to start quoting.'}
            />
          }
        />
      </Card>

      {dialogOpen && (
        <ProductDialog 
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          product={selectedProduct}
          categories={categories}
        />
      )}

      <ConfirmDialog 
        open={confirmOpen}
        title="Delete Item"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
