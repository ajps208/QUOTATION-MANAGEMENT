'use client';
import {
  Box, IconButton, Typography, Tooltip, InputAdornment, Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FormField from '@/components/common/FormField';
import FormGrid from '@/components/common/FormGrid';
import ProductAvatar from '@/components/common/ProductAvatar';
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

  const productOptions = products.map(p => ({ value: p.id, label: p.name }));
  const selectedProduct = item.productId ? products.find(p => p.id === item.productId) : null;

  return (
    <Box sx={{
      p: { xs: 2, sm: 2.5, md: 3 },
      bgcolor: '#F8FAFC',
      borderRadius: 2,
      mb: 2.5,
      border: '1px solid',
      borderColor: '#E2E8F0',
      position: 'relative',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        borderColor: '#C7D2FE',
        boxShadow: '0 2px 8px rgba(79,70,229,0.06)',
      },
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, gap: 1 }}>
        <Typography
          variant="caption"
          fontWeight={600}
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6875rem' }}
        >
          Item #{index + 1}
        </Typography>
        <Tooltip title="Remove item">
          <IconButton
            color="error"
            onClick={() => onRemove(index)}
            size="small"
            sx={{
              width: 32,
              height: 32,
              flexShrink: 0,
              '&:hover': { bgcolor: 'error.light', color: 'error.dark' },
            }}
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <FormGrid spacing={2.5}>
        {/* Row 1: Product */}
        <FormField
          xs={12}
          select
          label="Product / Service"
          value={item.productId || ''}
          onChange={(e) => handleProductChange(e.target.value)}
          options={productOptions}
          fullWidth
        />
        {selectedProduct && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: -1.5, mb: 0.5 }}>
            <ProductAvatar image={selectedProduct.image} name={selectedProduct.name} size={24} />
            <Typography variant="caption" color="text.secondary">
              {selectedProduct.sku && `${selectedProduct.sku}`}
            </Typography>
          </Box>
        )}

        {/* Row 2: Qty, Unit Price, Total */}
        <FormField
          xs={12} sm={4}
          label="Quantity"
          type="number"
          value={item.quantity}
          onChange={(e) => handleChange('quantity', Number(e.target.value))}
          slotProps={{ input: { min: 1 } }}
        />
        <FormField
          xs={12} sm={4}
          label="Unit Price"
          type="number"
          value={item.unitPrice}
          onChange={(e) => handleChange('unitPrice', Number(e.target.value))}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }
          }}
        />
        <Grid xs={12} sm={4}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 44,
            px: 1.5,
            bgcolor: 'white',
            borderRadius: 1,
            border: '1px solid',
            borderColor: '#E2E8F0',
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontSize: '0.8125rem', flexShrink: 0 }}>
              Total:
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ whiteSpace: 'nowrap' }}>
              {formatCurrency(lineTotal)}
            </Typography>
          </Box>
        </Grid>

        {/* Row 3: Discount Type, Discount Value, Tax */}
        <FormField
          xs={12} sm={4}
          select
          label="Discount Type"
          value={item.discountType || DISCOUNT_TYPE.NONE}
          onChange={(e) => handleChange('discountType', e.target.value)}
          options={[
            { value: DISCOUNT_TYPE.NONE, label: 'No Discount' },
            { value: DISCOUNT_TYPE.PERCENTAGE, label: 'Percentage (%)' },
            { value: DISCOUNT_TYPE.FIXED, label: 'Fixed Amount (₹)' },
          ]}
        />
        <FormField
          xs={12} sm={4}
          label="Discount Value"
          type="number"
          value={item.discountValue || 0}
          onChange={(e) => handleChange('discountValue', Number(e.target.value))}
          disabled={!item.discountType || item.discountType === DISCOUNT_TYPE.NONE}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {item.discountType === DISCOUNT_TYPE.PERCENTAGE ? '%' : '₹'}
                </InputAdornment>
              )
            }
          }}
        />
        <FormField
          xs={12} sm={4}
          label="Tax Rate"
          type="number"
          value={item.taxPercent || 0}
          onChange={(e) => handleChange('taxPercent', Number(e.target.value))}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }
          }}
        />
      </FormGrid>
    </Box>
  );
}
