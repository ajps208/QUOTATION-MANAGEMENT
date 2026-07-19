import mongoose from 'mongoose';

const quotationRevisionSchema = new mongoose.Schema({
  quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
  revisionNumber: { type: Number, required: true },
  quotationSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  changedByRole: { type: String, enum: ['business', 'customer'], required: true },
  changedByName: { type: String, default: '' },
  changedFields: [{ type: String }],
  status: { type: String, required: true },
  remarks: { type: String, default: '' }
}, { timestamps: true });

quotationRevisionSchema.index({ quotationId: 1, revisionNumber: 1 }, { unique: true });
quotationRevisionSchema.index({ quotationId: 1, createdAt: 1 });

export default mongoose.models.QuotationRevision || mongoose.model('QuotationRevision', quotationRevisionSchema);
