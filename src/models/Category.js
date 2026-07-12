import mongoose from 'mongoose';
import { CATEGORY_STATUS } from '@/constants/statuses';

const categorySchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String, default: null },
  status: { 
    type: String, 
    enum: Object.values(CATEGORY_STATUS),
    default: CATEGORY_STATUS.ACTIVE 
  }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
