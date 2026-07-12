import { DISCOUNT_TYPE } from '@/constants/discountTypes';
import { toCents, fromCents, clamp } from './numberUtils';

export function calculateDiscount(amount, type, value) {
  const amountInCents = toCents(amount);
  const rawDiscount = type === DISCOUNT_TYPE.PERCENTAGE
    ? Math.round(amountInCents * clamp(Number(value) || 0, 100) / 100)
    : type === DISCOUNT_TYPE.FIXED
      ? toCents(value)
      : 0;

  return fromCents(clamp(rawDiscount, amountInCents));
}

export function calculateQuotationTotals({ items = [], overallDiscount, specialDiscounts = [], additionalCharges = [] }) {
  const lineItems = items.map((item) => {
    // Treat subtotal as quantity * unitPrice
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    // Subtotal in standard units
    const subtotal = quantity * unitPrice;
    
    const discount = calculateDiscount(subtotal, item.discountType, item.discountValue);
    const taxableAmount = Math.max(0, subtotal - discount);
    
    // Tax is calculated on taxableAmount
    const taxPercent = Number(item.taxPercent) || 0;
    const tax = fromCents(Math.round(toCents(taxableAmount) * taxPercent / 100));

    return { ...item, subtotal, discount, taxableAmount, tax, total: taxableAmount + tax };
  });

  const subtotal = fromCents(lineItems.reduce((total, item) => total + toCents(item.subtotal), 0));
  const itemDiscount = fromCents(lineItems.reduce((total, item) => total + toCents(item.discount), 0));
  const amountAfterItems = Math.max(0, subtotal - itemDiscount);
  
  const overallDiscountAmount = calculateDiscount(amountAfterItems, overallDiscount?.type, overallDiscount?.value);
  const amountAfterOverall = Math.max(0, amountAfterItems - overallDiscountAmount);
  
  let availableForSpecialDiscounts = amountAfterOverall;
  const calculatedSpecialDiscounts = specialDiscounts.map((discount) => {
    const amount = calculateDiscount(availableForSpecialDiscounts, discount.type, discount.value);
    availableForSpecialDiscounts -= amount;
    return { ...discount, amount };
  });
  
  const specialDiscountTotal = fromCents(calculatedSpecialDiscounts.reduce((total, item) => total + toCents(item.amount), 0));
  const itemTax = fromCents(lineItems.reduce((total, item) => total + toCents(item.tax), 0));
  
  const calculatedCharges = additionalCharges.map((charge) => {
    const amount = Math.max(0, Number(charge.amount) || 0);
    const tax = charge.taxable ? fromCents(Math.round(toCents(amount) * (Number(charge.taxPercent) || 0) / 100)) : 0;
    return { ...charge, amount, tax };
  });
  
  const chargeTotal = fromCents(calculatedCharges.reduce((total, item) => total + toCents(item.amount), 0));
  const chargeTax = fromCents(calculatedCharges.reduce((total, item) => total + toCents(item.tax), 0));
  
  const totalTax = itemTax + chargeTax;
  const grandTotal = Math.max(0, availableForSpecialDiscounts + totalTax + chargeTotal);

  return { lineItems, subtotal, itemDiscount, overallDiscountAmount, calculatedSpecialDiscounts, specialDiscountTotal, calculatedCharges, chargeTotal, totalTax, grandTotal };
}
