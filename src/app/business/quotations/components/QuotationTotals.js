import { formatCurrency } from '@/utils/formatters';
import { DISCOUNT_TYPE } from '@/constants/discountTypes';

/**
 * Reusable Quotation Totals Summary component.
 * Accepts a `totals` object from calculateQuotationTotals().
 */
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
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td style={{ padding: '6px 0', color: '#475569', fontSize: '0.875rem' }}>{row.label}</td>
            <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 500, fontSize: '0.875rem', color: row.color || 'inherit' }}>
              {row.value < 0 ? `- ${formatCurrency(Math.abs(row.value))}` : formatCurrency(row.value)}
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={2} style={{ borderTop: '2px solid #e2e8f0', paddingTop: 8 }} />
        </tr>
        <tr>
          <td style={{ fontWeight: 700, fontSize: '1rem' }}>Grand Total</td>
          <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.25rem', color: '#4f46e5' }}>
            {formatCurrency(grandTotal)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
