'use client';
import { Box, IconButton, InputAdornment, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FormField from '@/components/common/FormField';
import FormGrid from '@/components/common/FormGrid';
import { DISCOUNT_TYPE } from '@/constants/discountTypes';

export default function DiscountRow({ discount, index, label = 'Discount', onUpdate, onRemove }) {
  const handleChange = (field, value) => {
    onUpdate(index, { ...discount, [field]: value });
  };

  return (
    <Box sx={{
      mb: 2,
      p: { xs: 2, md: 2.5 },
      bgcolor: '#F0FDF4',
      borderRadius: 1.5,
      border: '1px solid',
      borderColor: '#D1FAE5',
      transition: 'border-color 0.2s ease',
      '&:hover': { borderColor: '#A7F3D0' },
    }}>
      <Grid container spacing={2} alignItems="center">
        <Grid xs={12} sm={4}>
          <FormField
            label={`${label} Name`}
            fullWidth
            size="small"
            value={discount.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Loyalty Discount"
          />
        </Grid>
        <Grid xs={12} sm={3}>
          <FormField
            select
            fullWidth
            size="small"
            label="Type"
            value={discount.type || DISCOUNT_TYPE.PERCENTAGE}
            onChange={(e) => handleChange('type', e.target.value)}
            options={[
              { value: DISCOUNT_TYPE.PERCENTAGE, label: 'Percentage (%)' },
              { value: DISCOUNT_TYPE.FIXED, label: 'Fixed (₹)' },
            ]}
          />
        </Grid>
        <Grid xs={9} sm={4}>
          <FormField
            label="Value"
            type="number"
            fullWidth
            size="small"
            value={discount.value || 0}
            onChange={(e) => handleChange('value', Number(e.target.value))}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {discount.type === DISCOUNT_TYPE.PERCENTAGE ? '%' : '₹'}
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
        <Grid xs={3} sm={1}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton
              color="error"
              size="small"
              onClick={() => onRemove(index)}
              sx={{
                width: 32,
                height: 32,
                '&:hover': { bgcolor: 'error.light', color: 'error.dark' },
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
