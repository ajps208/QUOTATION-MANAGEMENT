'use client';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, InputAdornment, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DISCOUNT_TYPE } from '@/constants/discountTypes';

export default function DiscountRow({ discount, index, label = 'Discount', onUpdate, onRemove }) {
  const handleChange = (field, value) => {
    onUpdate(index, { ...discount, [field]: value });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            label={`${label} Name`}
            fullWidth
            value={discount.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Loyalty Discount"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={discount.type || DISCOUNT_TYPE.PERCENTAGE}
              label="Type"
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <MenuItem value={DISCOUNT_TYPE.PERCENTAGE}>Percentage (%)</MenuItem>
              <MenuItem value={DISCOUNT_TYPE.FIXED}>Fixed (₹)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={10} sm={4}>
          <TextField
            label="Value"
            type="number"
            fullWidth
            value={discount.value || 0}
            onChange={(e) => handleChange('value', Number(e.target.value))}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {discount.type === DISCOUNT_TYPE.PERCENTAGE ? '%' : '₹'}
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <IconButton color="error" onClick={() => onRemove(index)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
}
