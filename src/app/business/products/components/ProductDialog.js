'use client';
import { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Grid, InputAdornment } from '@mui/material';
import AppDialog from '@/components/common/AppDialog';
import { PRODUCT_STATUS } from '@/constants/statuses';
import { PRODUCT_TYPE } from '@/constants/productTypes';
import { UNITS } from '@/constants/units';

export default function ProductDialog({ open, onClose, onSave, product, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    type: PRODUCT_TYPE.PRODUCT,
    unit: UNITS.ITEM,
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
        unit: product.unit || UNITS.ITEM,
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
        unit: UNITS.ITEM,
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

  const actions = (
    <>
      <Button onClick={onClose} disabled={loading} color="inherit">Cancel</Button>
      <Button onClick={handleSubmit} disabled={loading || !formData.name || !formData.categoryId} variant="contained">
        {loading ? 'Saving...' : 'Save Item'}
      </Button>
    </>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={product ? 'Edit Item' : 'Add Item'}
      actions={actions}
      maxWidth="md"
    >
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={8}>
            <TextField
              label="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
              autoFocus
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              label="SKU / Code"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              fullWidth
            />
          </Grid>
          
          <Grid xs={12} sm={6}>
            <TextField
              select
              label="Category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              fullWidth
            >
              {categories.length === 0 && <MenuItem value="" disabled>No categories available</MenuItem>}
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              select
              label="Item Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              fullWidth
            >
              {Object.values(PRODUCT_TYPE).map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid xs={12} sm={4}>
            <TextField
              label="Base Price"
              type="number"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
              fullWidth
              required
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }
              }}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              select
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              fullWidth
            >
              {Object.values(UNITS).map((unit) => (
                <MenuItem key={unit} value={unit}>{unit}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              label="Tax %"
              type="number"
              value={formData.taxPercent}
              onChange={(e) => setFormData({ ...formData, taxPercent: Number(e.target.value) })}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }
              }}
            />
          </Grid>

          <Grid xs={12}>
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              fullWidth
            >
              <MenuItem value={PRODUCT_STATUS.ACTIVE}>Active</MenuItem>
              <MenuItem value={PRODUCT_STATUS.INACTIVE}>Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>
    </AppDialog>
  );
}
