import { Box, Typography, Divider } from '@mui/material';
import { formatCurrency } from '@/utils/formatters';

export default function QuotationTotals({ totals, currency = 'INR' }) {
  if (!totals) return null;

  const {
    subtotal = 0,
    itemDiscount = 0,
    overallDiscountAmount = 0,
    specialDiscountTotal = 0,
    chargeTotal = 0,
    totalTax = 0,
    grandTotal = 0,
  } = totals;

  const rows = [
    { label: 'Subtotal', value: subtotal },
    itemDiscount > 0 && { label: 'Item Discounts', value: -itemDiscount, color: 'success.main' },
    overallDiscountAmount > 0 && { label: 'Overall Discount', value: -overallDiscountAmount, color: 'success.main' },
    specialDiscountTotal > 0 && { label: 'Special Discounts', value: -specialDiscountTotal, color: 'success.main' },
    chargeTotal > 0 && { label: 'Additional Charges', value: chargeTotal },
    { label: 'Tax', value: totalTax },
  ].filter(Boolean);

  return (
    <Box>
      {rows.map((row, i) => (
        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
          <Typography variant="body2" color="text.secondary">{row.label}</Typography>
          <Typography variant="body2" fontWeight={500} color={row.color || 'text.primary'}>
            {row.value < 0 ? `- ${formatCurrency(Math.abs(row.value))}` : formatCurrency(row.value)}
          </Typography>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight={700}>Grand Total</Typography>
        <Typography variant="h6" fontWeight={700} color="primary.main">
          {formatCurrency(grandTotal)}
        </Typography>
      </Box>
    </Box>
  );
}
