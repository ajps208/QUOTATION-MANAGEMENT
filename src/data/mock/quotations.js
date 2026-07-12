import { QUOTATION_STATUS } from '@/constants/statuses';
import { DISCOUNT_TYPE } from '@/constants/discountTypes';

export const mockQuotations = [
  {
    id: 'quot_1',
    quotationNumber: 'NS-QT-2025-0001',
    businessId: 'biz_1',
    customerId: 'cust_1',
    requestId: 'REQ-2025-001',
    quotationDate: '2025-04-11T10:00:00Z',
    expiryDate: '2025-05-11T10:00:00Z',
    currency: 'INR',
    items: [
      {
        productId: 'prod_1',
        name: 'ERP Starter Pack',
        quantity: 1,
        unitPrice: 150000,
        discountType: DISCOUNT_TYPE.PERCENTAGE,
        discountValue: 10, // 10% discount
        taxPercent: 18,
      },
      {
        productId: 'prod_2',
        name: 'Cloud Migration Advisory',
        quantity: 20,
        unitPrice: 2500,
        discountType: DISCOUNT_TYPE.NONE,
        discountValue: 0,
        taxPercent: 18,
      }
    ],
    overallDiscount: {
      type: DISCOUNT_TYPE.FIXED,
      value: 5000,
    },
    specialDiscounts: [
      {
        name: 'Loyal Customer Discount',
        type: DISCOUNT_TYPE.PERCENTAGE,
        value: 2,
      }
    ],
    additionalCharges: [
      {
        name: 'Setup Fee',
        amount: 10000,
        taxable: true,
        taxPercent: 18,
      }
    ],
    paymentTerms: '50% advance, 50% post-implementation.',
    terms: 'Valid for 30 days. Software licenses are subject to EULA.',
    businessNotes: 'Applied standard 10% discount on ERP pack as discussed.',
    customerNotes: 'Please provide your best quotation considering we are an existing customer looking to expand.',
    status: QUOTATION_STATUS.SENT,
    revision: 0,
    createdAt: '2025-04-11T10:00:00Z',
    updatedAt: '2025-04-11T10:00:00Z',
    // Pre-calculated values for the mock (would be calculated dynamically in UI)
    subtotal: 200000,
    itemDiscount: 15000,
    overallDiscountAmount: 5000,
    specialDiscountTotal: 3600,
    chargeTotal: 10000,
    totalTax: 33552, // Just a mock value, actual calculation will be done by utils
    grandTotal: 229952,
  },
  {
    id: 'quot_2',
    quotationNumber: 'BB-2025-0001',
    businessId: 'biz_2',
    customerId: 'cust_2',
    requestId: 'REQ-2025-002',
    quotationDate: '2025-04-13T10:00:00Z',
    expiryDate: '2025-04-28T10:00:00Z',
    currency: 'INR',
    items: [
      {
        productId: 'prod_3',
        name: 'Office Layout Design',
        quantity: 1,
        unitPrice: 75000,
        discountType: DISCOUNT_TYPE.PERCENTAGE,
        discountValue: 5,
        taxPercent: 18,
      }
    ],
    overallDiscount: { type: DISCOUNT_TYPE.NONE, value: 0 },
    specialDiscounts: [],
    additionalCharges: [],
    paymentTerms: '100% advance for design services',
    terms: 'Design revisions limited to 2 rounds.',
    businessNotes: '',
    customerNotes: 'Looking for modern, open-plan concepts.',
    status: QUOTATION_STATUS.ACCEPTED,
    revision: 0,
    createdAt: '2025-04-13T10:00:00Z',
    updatedAt: '2025-04-15T14:30:00Z',
    subtotal: 75000,
    itemDiscount: 3750,
    overallDiscountAmount: 0,
    specialDiscountTotal: 0,
    chargeTotal: 0,
    totalTax: 12825,
    grandTotal: 84075,
  }
];
