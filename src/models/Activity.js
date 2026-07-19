import mongoose from 'mongoose';
import { USER_ROLES } from '@/constants/roles';

const activitySchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  action: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  role: { type: String, enum: Object.values(USER_ROLES) },
  date: { type: Date, default: Date.now },
  details: { type: String }
}, { timestamps: true });

activitySchema.index({ businessId: 1, createdAt: -1 });

export default mongoose.models.Activity || mongoose.model('Activity', activitySchema);
