import mongoose from 'mongoose';
import { REQUEST_STATUS } from '@/constants/statuses';

const quotationRequestSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    notes: { type: String }
  }],
  generalNote: { type: String },
  requestDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: Object.values(REQUEST_STATUS),
    default: REQUEST_STATUS.SUBMITTED 
  },
  rejectionReason: { type: String },
  quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
  resolvedCustomerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
}, { timestamps: true });

quotationRequestSchema.index({ businessId: 1, createdAt: -1 });
quotationRequestSchema.index({ customerId: 1, createdAt: -1 });

export default mongoose.models.QuotationRequest || mongoose.model('QuotationRequest', quotationRequestSchema);
