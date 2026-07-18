'use client';
import { useState, useEffect } from 'react';
import { Box, Button, Grid, InputAdornment } from '@mui/material';
import AppDialog from '@/components/common/AppDialog';
import FormField from '@/components/common/FormField';
import FormGrid from '@/components/common/FormGrid';
import { PRODUCT_STATUS } from '@/constants/statuses';
import { PRODUCT_TYPE } from '@/constants/productTypes';
import { UNITS } from '@/constants/units';

export default function ProductDialog({ open, onClose, onSave, product, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    type: PRODUCT_TYPE.PRODUCT,
    unit: UNITS.PIECE,
    basePrice: 0,
    taxPercent: 18,
    description: '',
    status: PRODUCT_STATUS.ACTIVE,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        categoryId: product.categoryId || '',
        type: product.type || PRODUCT_TYPE.PRODUCT,
        unit: product.unit || UNITS.PIECE,
        basePrice: product.basePrice || 0,
        taxPercent: product.taxPercent ?? 18,
        description: product.description || '',
        status: product.status || PRODUCT_STATUS.ACTIVE,
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        type: PRODUCT_TYPE.PRODUCT,
        unit: UNITS.PIECE,
        basePrice: 0,
        taxPercent: 18,
        description: '',
        status: PRODUCT_STATUS.ACTIVE,
      });
    }
  }, [product, open, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  const categoryOptions = categories.map((cat) => ({ value: cat.id, label: cat.name }));
  const typeOptions = Object.values(PRODUCT_TYPE).map((type) => ({ value: type, label: type }));
  const unitOptions = Object.values(UNITS).map((unit) => ({ value: unit, label: unit }));
  const statusOptions = [
    { value: PRODUCT_STATUS.ACTIVE, label: 'Active' },
    { value: PRODUCT_STATUS.INACTIVE, label: 'Inactive' },
  ];

  const actions = (
    <>
      <Button onClick={onClose} disabled={loading} color="inherit" sx={{ borderRadius: 1 }}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={loading || !formData.name || !formData.categoryId}
        variant="contained"
        sx={{ borderRadius: 1, minWidth: 120 }}
      >
        {loading ? 'Saving...' : 'Save Item'}
      </Button>
    </>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={product ? 'Edit Item' : 'Add New Item'}
      subtitle={product ? 'Update item details below' : 'Fill in the details to add a new item'}
      actions={actions}
      maxWidth="md"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <FormGrid spacing={2.5}>
          <FormField xs={12} sm={8} label="Item Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required autoFocus placeholder="e.g., Web Design Package" />
          <FormField xs={12} sm={4} label="SKU / Code" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g., WEB-001" />
          
          <FormField xs={12} sm={6} select label="Category" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required options={categoryOptions} />
          <FormField xs={12} sm={6} select label="Item Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} options={typeOptions} />

          <FormField
            xs={12} sm={4}
            label="Base Price"
            type="number"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
            required
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }
            }}
          />
          <FormField xs={12} sm={4} select label="Unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} options={unitOptions} />
          <FormField
            xs={12} sm={4}
            label="Tax Rate"
            type="number"
            value={formData.taxPercent}
            onChange={(e) => setFormData({ ...formData, taxPercent: Number(e.target.value) })}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }
            }}
          />

          <FormField
            xs={12}
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
            placeholder="Describe this item..."
          />

          <FormField xs={12} sm={6} select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={statusOptions} />
        </FormGrid>
      </Box>
    </AppDialog>
  );
}
