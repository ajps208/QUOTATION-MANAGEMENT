import mongoose from 'mongoose';
import { BUSINESS_STATUS } from '@/constants/statuses';

const businessProfileSchema = new mongoose.Schema({
  businessName: { type: String, default: '' },
  legalBusinessName: { type: String, default: '' },
  businessType: { type: String, default: '' },
  industry: { type: String, default: '' },
  businessCategory: { type: String, default: '' },
  registrationNumber: { type: String, default: '' },
  gstVatNumber: { type: String, default: '' },
  panTaxNumber: { type: String, default: '' },
  yearEstablished: { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: false });

const businessContactSchema = new mongoose.Schema({
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  mobile: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  website: { type: String, default: '' },
}, { _id: false });

const businessAddressSchema = new mongoose.Schema({
  addressLine1: { type: String, default: '' },
  addressLine2: { type: String, default: '' },
  city: { type: String, default: '' },
  district: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: 'India' },
  postalCode: { type: String, default: '' },
}, { _id: false });

const businessOwnerSchema = new mongoose.Schema({
  ownerName: { type: String, default: '' },
  designation: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
}, { _id: false });

const businessBrandingSchema = new mongoose.Schema({
  logo: { type: String, default: null },
  seal: { type: String, default: null },
  primaryColor: { type: String, default: '#4f46e5' },
  secondaryColor: { type: String, default: '#0ea5e9' },
  accentColor: { type: String, default: '#10b981' },
  defaultFont: { type: String, default: 'Inter, sans-serif' },
  tagline: { type: String, default: '' },
}, { _id: false });

const businessSignatureSchema = new mongoose.Schema({
  type: { type: String, default: 'custom' },
  displayName: { type: String, default: '' },
  image: { type: String, default: null },
  uploadedBy: { type: String, default: '' },
  uploadedAt: { type: Date, default: Date.now },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: true });

const businessQuotationSettingsSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuotationTemplate', default: null },
  quotationPrefix: { type: String, default: 'QT' },
  currency: { type: String, default: 'INR' },
  taxPercent: { type: Number, default: 18 },
  validityDays: { type: Number, default: 30 },
  paymentTerms: { type: String, default: '' },
  defaultTerms: { type: String, default: 'Valid for 30 days.' },
  bankDetails: { type: String, default: '' },
  footerText: { type: String, default: 'Thank you for your business!' },
  quotationTitle: { type: String, default: 'QUOTATION' },
  dateFormat: { type: String, default: 'DD MMM YYYY' },
  headerLayout: { type: String, default: 'logo-left', enum: ['logo-left', 'centered', 'logo-right'] },
  tableStyle: { type: String, default: 'striped', enum: ['striped', 'plain', 'bordered'] },
  fontSize: { type: String, default: 'md', enum: ['sm', 'md', 'lg'] },
  logoSize: { type: String, default: 'md', enum: ['sm', 'md', 'lg'] },
  showLogo: { type: Boolean, default: true },
  showBusinessInfo: { type: Boolean, default: true },
  showCustomerInfo: { type: Boolean, default: true },
  showQuotationNumber: { type: Boolean, default: true },
  showDates: { type: Boolean, default: true },
  showDiscounts: { type: Boolean, default: true },
  showTax: { type: Boolean, default: true },
  showSubtotal: { type: Boolean, default: true },
  showItemNotes: { type: Boolean, default: false },
  showTerms: { type: Boolean, default: true },
  showNotes: { type: Boolean, default: true },
  showSignature: { type: Boolean, default: false },
  showBankDetails: { type: Boolean, default: false },
  showFooter: { type: Boolean, default: true },
}, { _id: false });

const businessPreferencesSchema = new mongoose.Schema({
  language: { type: String, default: 'en' },
  timezone: { type: String, default: 'Asia/Kolkata' },
  dateFormat: { type: String, default: 'DD MMM YYYY' },
  numberFormat: { type: String, default: 'en-IN' },
  emailNotifications: { type: Boolean, default: true },
  autoSave: { type: Boolean, default: true },
}, { _id: false });

const businessSocialLinksSchema = new mongoose.Schema({
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  youtube: { type: String, default: '' },
}, { _id: false });

const businessSchema = new mongoose.Schema({
  profile: { type: businessProfileSchema, default: () => ({}) },
  contact: { type: businessContactSchema, default: () => ({}) },
  address: { type: businessAddressSchema, default: () => ({}) },
  owner: { type: businessOwnerSchema, default: () => ({}) },
  branding: { type: businessBrandingSchema, default: () => ({}) },
  signatures: { type: [businessSignatureSchema], default: [] },
  quotationSettings: { type: businessQuotationSettingsSchema, default: () => ({}) },
  preferences: { type: businessPreferencesSchema, default: () => ({}) },
  socialLinks: { type: businessSocialLinksSchema, default: () => ({}) },
  status: {
    type: String,
    enum: Object.values(BUSINESS_STATUS),
    default: BUSINESS_STATUS.ACTIVE,
  },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
}, { timestamps: true });

businessSchema.index({ 'profile.businessName': 'text', 'contact.email': 1 });

if (mongoose.models.Business) {
  delete mongoose.models.Business;
  delete mongoose.connection.models.Business;
}

export default mongoose.model('Business', businessSchema);
