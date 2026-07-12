'use client';
import { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import AppDialog from '@/components/common/AppDialog';
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

  const actions = (
    <>
      <Button onClick={onClose} disabled={loading} color="inherit">Cancel</Button>
      <Button onClick={handleSubmit} disabled={loading || !formData.name} variant="contained">
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      actions={actions}
    >
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField
          label="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          autoFocus
        />
        <TextField
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          multiline
          rows={3}
        />
        <TextField
          select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <MenuItem value={CATEGORY_STATUS.ACTIVE}>Active</MenuItem>
          <MenuItem value={CATEGORY_STATUS.INACTIVE}>Inactive</MenuItem>
        </TextField>
      </Box>
    </AppDialog>
  );
}
