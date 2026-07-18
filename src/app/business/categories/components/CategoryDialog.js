'use client';
import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import AppDialog from '@/components/common/AppDialog';
import FormField from '@/components/common/FormField';
import { CATEGORY_STATUS } from '@/constants/statuses';

export default function CategoryDialog({ open, onClose, onSave, category }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: CATEGORY_STATUS.ACTIVE,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        status: category.status || CATEGORY_STATUS.ACTIVE,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: CATEGORY_STATUS.ACTIVE,
      });
    }
  }, [category, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  const statusOptions = [
    { value: CATEGORY_STATUS.ACTIVE, label: 'Active' },
    { value: CATEGORY_STATUS.INACTIVE, label: 'Inactive' },
  ];

  const actions = (
    <>
      <Button onClick={onClose} disabled={loading} color="inherit" sx={{ borderRadius: 1 }}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={loading || !formData.name}
        variant="contained"
        sx={{ borderRadius: 1, minWidth: 120 }}
      >
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add New Category'}
      subtitle={category ? 'Update category details' : 'Create a new category to organize items'}
      actions={actions}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <FormField
          label="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          autoFocus
          placeholder="e.g., Software, Hardware, Services"
        />
        <FormField
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          multiline
          rows={3}
          placeholder="Describe this category..."
        />
        <FormField
          select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          options={statusOptions}
        />
      </Box>
    </AppDialog>
  );
}
