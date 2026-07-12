import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  companyName: { type: String },
  email: { type: String },
  phone: { type: String },
  alternativePhone: { type: String },
  taxNumber: { type: String },
  billingAddress: { type: String },
  shippingAddress: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: 'India' },
  postalCode: { type: String },
  notes: { type: String },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);
