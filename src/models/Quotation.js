import mongoose from 'mongoose';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { DISCOUNT_TYPE } from '@/constants/discountTypes';

const quotationSchema = new mongoose.Schema({
  quotationNumber: { type: String, required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuotationRequest', default: null },
  quotationDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  currency: { type: String, default: 'INR' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    discountType: { type: String, enum: Object.values(DISCOUNT_TYPE), default: DISCOUNT_TYPE.NONE },
    discountValue: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 18 },
    unit: { type: String }
  }],
  overallDiscount: {
    type: { type: String, enum: Object.values(DISCOUNT_TYPE), default: DISCOUNT_TYPE.NONE },
    value: { type: Number, default: 0 }
  },
  specialDiscounts: [{
    name: { type: String },
    type: { type: String, enum: Object.values(DISCOUNT_TYPE) },
    value: { type: Number }
  }],
  additionalCharges: [{
    name: { type: String },
    amount: { type: Number },
    taxable: { type: Boolean, default: false },
    taxPercent: { type: Number, default: 18 }
  }],
  paymentTerms: { type: String },
  terms: { type: String },
  businessNotes: { type: String },
  customerNotes: { type: String },
  status: { 
    type: String, 
    enum: Object.values(QUOTATION_STATUS),
    default: QUOTATION_STATUS.DRAFT 
  },
  rejectionReason: { type: String, default: null },
  revision: { type: Number, default: 0 },
  settings: { type: mongoose.Schema.Types.Mixed, default: null }
}, { timestamps: true });

quotationSchema.index({ businessId: 1, status: 1, createdAt: -1 });
quotationSchema.index({ customerId: 1, createdAt: -1 });
quotationSchema.index({ businessId: 1, createdAt: -1 });
quotationSchema.index({ requestId: 1 });

export default mongoose.models.Quotation || mongoose.model('Quotation', quotationSchema);
