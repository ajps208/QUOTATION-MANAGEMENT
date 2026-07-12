import mongoose from 'mongoose';
import { USER_ROLES } from '@/constants/roles';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.CUSTOMER 
  },
  phone: { type: String },
  company: { type: String },
  avatar: { type: String },
  bio: { type: String },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
