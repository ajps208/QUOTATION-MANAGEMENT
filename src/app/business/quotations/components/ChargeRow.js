'use client';
import { Box, IconButton, InputAdornment, Switch, FormControlLabel, Grid, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FormField from '@/components/common/FormField';
import FormGrid from '@/components/common/FormGrid';

export default function ChargeRow({ charge, index, onUpdate, onRemove }) {
  const handleChange = (field, value) => {
    onUpdate(index, { ...charge, [field]: value });
  };

  return (
    <Box sx={{
      mb: 2,
      p: { xs: 2, md: 2.5 },
      bgcolor: '#FFF7ED',
      borderRadius: 1.5,
      border: '1px solid',
      borderColor: '#FED7AA',
      transition: 'border-color 0.2s ease',
      '&:hover': { borderColor: '#FDBA74' },
    }}>
      <Grid container spacing={2} alignItems="center">
        <Grid xs={12} sm={3}>
          <FormField
            label="Charge Name"
            fullWidth
            size="small"
            value={charge.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Setup Fee, Delivery"
          />
        </Grid>
        <Grid xs={12} sm={3}>
          <FormField
            label="Amount"
            type="number"
            fullWidth
            size="small"
            value={charge.amount || 0}
            onChange={(e) => handleChange('amount', Number(e.target.value))}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }
            }}
          />
        </Grid>
        <Grid xs={6} sm={3}>
          <FormControlLabel
            control={
              <Switch
                checked={charge.taxable || false}
                onChange={(e) => handleChange('taxable', e.target.checked)}
                size="small"
              />
            }
            label={<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>Taxable</Typography>}
          />
        </Grid>
        <Grid xs={6} sm={2}>
          {charge.taxable && (
            <FormField
              label="Tax Rate"
              type="number"
              fullWidth
              size="small"
              value={charge.taxPercent || 18}
              onChange={(e) => handleChange('taxPercent', Number(e.target.value))}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }
              }}
            />
          )}
        </Grid>
        <Grid xs={12} sm={1}>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-end', sm: 'center' } }}>
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
