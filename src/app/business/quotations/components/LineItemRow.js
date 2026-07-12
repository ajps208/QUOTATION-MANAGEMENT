'use client';
import {
  Box, IconButton, TextField, Select, MenuItem,
  FormControl, InputLabel, Typography, Tooltip, InputAdornment, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DISCOUNT_TYPE } from '@/constants/discountTypes';
import { formatCurrency } from '@/utils/formatters';

export default function LineItemRow({ item, index, products, onUpdate, onRemove }) {
  const subtotal = (item.quantity || 0) * (item.unitPrice || 0);
  const discountAmt = item.discountType === DISCOUNT_TYPE.PERCENTAGE
    ? subtotal * (item.discountValue || 0) / 100
    : item.discountType === DISCOUNT_TYPE.FIXED
      ? Math.min(item.discountValue || 0, subtotal)
      : 0;
  const taxable = Math.max(0, subtotal - discountAmt);
  const taxAmt = taxable * (item.taxPercent || 0) / 100;
  const lineTotal = taxable + taxAmt;

  const handleChange = (field, value) => {
    onUpdate(index, { ...item, [field]: value });
  };

  const handleProductChange = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      onUpdate(index, {
        ...item,
        productId: product.id,
        name: product.name,
        unitPrice: product.basePrice,
        taxPercent: product.taxPercent,
        unit: product.unit,
        quantity: product.minQuantity || 1,
      });
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: '#f8fafc', 
      borderRadius: 3, 
      mb: 3,
      border: '1px solid',
      borderColor: 'divider',
      position: 'relative'
    }}>
      <Tooltip title="Remove item">
        <IconButton 
          color="error" 
          onClick={() => onRemove(index)} 
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      
      <Grid container spacing={3} sx={{ pr: 4 }}>
        {/* Row 1: Product, Qty, Unit Price */}
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Product</InputLabel>
            <Select
              value={item.productId || ''}
              label="Product"
              onChange={(e) => handleProductChange(e.target.value)}
            >
              {products.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={6} md={3}>
          <TextField
            label="Qty"
            type="number"
            fullWidth
            value={item.quantity}
            onChange={(e) => handleChange('quantity', Number(e.target.value))}
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </Grid>

        <Grid xs={6} md={3}>
          <TextField
            label="Unit Price"
            type="number"
            fullWidth
            value={item.unitPrice}
            onChange={(e) => handleChange('unitPrice', Number(e.target.value))}
            slotProps={{ input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> } }}
          />
        </Grid>

        {/* Row 2: Discount, Tax, Total */}
        <Grid xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Disc. Type</InputLabel>
            <Select
              value={item.discountType || DISCOUNT_TYPE.NONE}
              label="Disc. Type"
              onChange={(e) => handleChange('discountType', e.target.value)}
            >
              <MenuItem value={DISCOUNT_TYPE.NONE}>None</MenuItem>
              <MenuItem value={DISCOUNT_TYPE.PERCENTAGE}>%</MenuItem>
              <MenuItem value={DISCOUNT_TYPE.FIXED}>Fixed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid xs={6} md={3}>
          <TextField
            label="Disc. Value"
            type="number"
            fullWidth
            value={item.discountValue || 0}
            onChange={(e) => handleChange('discountValue', Number(e.target.value))}
            disabled={!item.discountType || item.discountType === DISCOUNT_TYPE.NONE}
          />
        </Grid>

        <Grid xs={6} md={3}>
          <TextField
            label="Tax %"
            type="number"
            fullWidth
            value={item.taxPercent || 0}
            onChange={(e) => handleChange('taxPercent', Number(e.target.value))}
            slotProps={{ input: { endAdornment: <InputAdornment position="end">%</InputAdornment> } }}
          />
        </Grid>

        <Grid xs={6} md={3}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary" mr={2}>Total:</Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {formatCurrency(lineTotal)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
