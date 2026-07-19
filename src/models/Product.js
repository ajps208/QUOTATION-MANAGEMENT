import mongoose from 'mongoose';
import { PRODUCT_STATUS } from '@/constants/statuses';
import { PRODUCT_TYPE } from '@/constants/productTypes';
import { UNITS } from '@/constants/units';

const productSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  code: { type: String },
  sku: { type: String },
  image: { type: String, default: null },
  imageMeta: {
    fileName: { type: String, default: null },
    fileSize: { type: Number, default: null },
    mimeType: { type: String, default: null },
    uploadedAt: { type: Date, default: null },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  description: { type: String },
  unit: { 
    type: String, 
    enum: Object.values(UNITS),
    default: UNITS.PIECE 
  },
  basePrice: { type: Number, required: true },
  taxPercent: { type: Number, default: 18 },
  discount: { type: Number, default: 0 },
  minQuantity: { type: Number, default: 1 },
  type: { 
    type: String, 
    enum: Object.values(PRODUCT_TYPE),
    default: PRODUCT_TYPE.PRODUCT 
  },
  status: { 
    type: String, 
    enum: Object.values(PRODUCT_STATUS),
    default: PRODUCT_STATUS.ACTIVE 
  }
}, { timestamps: true });

productSchema.index({ businessId: 1, status: 1 });
productSchema.index({ businessId: 1, categoryId: 1 });
productSchema.index({ businessId: 1, name: 'text' });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
