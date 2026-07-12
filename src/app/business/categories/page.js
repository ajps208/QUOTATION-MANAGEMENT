'use client';
import { useState, useEffect } from 'react';
import { Box, Button, IconButton, TextField, Card } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAuthStore } from '@/store/useAuthStore';
import { categoryService } from '@/services/categoryService';
import PageHeader from '@/components/common/PageHeader';
import AppTable from '@/components/common/AppTable';
import AppSearch from '@/components/common/AppSearch';
import EmptyState from '@/components/common/EmptyState';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useSnackbar } from '@/hooks/useSnackbar';
import CategoryDialog from './components/CategoryDialog';
import { formatDate } from '@/utils/formatters';

export default function CategoriesPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    if (!user?.businessId) return;
    setLoading(true);
    try {
      const data = await categoryService.getCategories(user.businessId);
      setCategories(data);
    } catch (error) {
      showError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

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
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      showSuccess('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      showError('Failed to delete category');
    } finally {
      setConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSave = async (formData) => {
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
    } catch (error) {
      showError('Failed to save category');
    }
  };

  const columns = [
    { field: 'name', label: 'Name' },
    { field: 'description', label: 'Description' },
    { 
      field: 'status', 
      label: 'Status',
      render: (row) => <StatusChip status={row.status} />
    },
    { 
      field: 'createdAt', 
      label: 'Created',
      render: (row) => formatDate(row.createdAt)
    },
    {
      field: 'actions',
      label: 'Actions',
      align: 'right',
      width: 120,
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => handleEdit(row)} size="small" color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(row)} size="small" color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <PageHeader 
        title="Categories" 
        subtitle="Manage product and service categories"
        actionLabel="Add Category"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <Box sx={{ mb: 4 }}>
        <AppSearch 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search categories..."
        />
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        <AppTable 
          columns={columns}
          data={filteredCategories}
          emptyState={
            <EmptyState 
              title="No categories found" 
              description={search ? 'Try adjusting your search query' : 'Create your first category to organize your products and services.'}
            />
          }
        />
      </Card>

      {dialogOpen && (
        <CategoryDialog 
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          category={selectedCategory}
        />
      )}

      <ConfirmDialog 
        open={confirmOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
