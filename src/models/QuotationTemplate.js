import mongoose from 'mongoose';

const quotationTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  primaryColor: { type: String },
  headerLayout: { type: String },
  showBusinessInfo: { type: Boolean, default: true },
  showCustomerInfo: { type: Boolean, default: true },
  showDiscounts: { type: Boolean, default: true },
  showTax: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.QuotationTemplate || mongoose.model('QuotationTemplate', quotationTemplateSchema);
