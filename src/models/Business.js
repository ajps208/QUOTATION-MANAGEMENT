import mongoose from 'mongoose';
import { BUSINESS_STATUS } from '@/constants/statuses';

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: null },
  type: { type: String },
  industry: { type: String },
  description: { type: String },
  ownerName: { type: String },
  email: { type: String },
  phone: { type: String },
  website: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: 'India' },
  postalCode: { type: String },
  currency: { type: String, default: 'INR' },
  taxPercent: { type: Number, default: 18 },
  quotationPrefix: { type: String, default: 'QT' },
  validityDays: { type: Number, default: 30 },
  paymentTerms: { type: String },
  status: { 
    type: String, 
    enum: Object.values(BUSINESS_STATUS),
    default: BUSINESS_STATUS.ACTIVE 
  },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
}, { timestamps: true });

export default mongoose.models.Business || mongoose.model('Business', businessSchema);
