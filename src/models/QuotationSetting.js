import mongoose from 'mongoose';

const quotationSettingSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, unique: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuotationTemplate' },
  primaryColor: { type: String },
  accentColor: { type: String },
  fontFamily: { type: String },
  fontSize: { type: String, enum: ['sm', 'md', 'lg'] },
  quotationTitle: { type: String },
  headerLayout: { type: String, enum: ['logo-left', 'centered', 'logo-right'] },
  logoSize: { type: String, enum: ['sm', 'md', 'lg'] },
  showLogo: { type: Boolean },
  showBusinessInfo: { type: Boolean },
  showCustomerInfo: { type: Boolean },
  showQuotationNumber: { type: Boolean },
  showDates: { type: Boolean },
  showDiscounts: { type: Boolean },
  showTax: { type: Boolean },
  showSubtotal: { type: Boolean },
  showItemNotes: { type: Boolean },
  showTerms: { type: Boolean },
  showNotes: { type: Boolean },
  showSignature: { type: Boolean },
  showBankDetails: { type: Boolean },
  showFooter: { type: Boolean },
  tableStyle: { type: String, enum: ['striped', 'plain', 'bordered'] },
  footerText: { type: String },
  bankDetails: { type: String },
  defaultTerms: { type: String },
  quotationPrefix: { type: String },
  dateFormat: { type: String },
  signatures: { type: [{ id: String, label: String, type: String, dataUrl: String }], default: [] }
}, { timestamps: true });

export default mongoose.models.QuotationSetting || mongoose.model('QuotationSetting', quotationSettingSchema);
