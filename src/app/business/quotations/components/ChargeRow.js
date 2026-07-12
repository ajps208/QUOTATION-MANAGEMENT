'use client';
import { Box, TextField, IconButton, InputAdornment, Switch, FormControlLabel, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ChargeRow({ charge, index, onUpdate, onRemove }) {
  const handleChange = (field, value) => {
    onUpdate(index, { ...charge, [field]: value });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            label="Charge Name"
            fullWidth
            value={charge.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Setup Fee, Delivery"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={charge.amount || 0}
            onChange={(e) => handleChange('amount', Number(e.target.value))}
            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControlLabel
            control={
              <Switch
                checked={charge.taxable || false}
                onChange={(e) => handleChange('taxable', e.target.checked)}
              />
            }
            label="Taxable"
          />
        </Grid>
        <Grid item xs={4} sm={2}>
          {charge.taxable && (
            <TextField
              label="Tax %"
              type="number"
              fullWidth
              value={charge.taxPercent || 18}
              onChange={(e) => handleChange('taxPercent', Number(e.target.value))}
              InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
            />
          )}
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
