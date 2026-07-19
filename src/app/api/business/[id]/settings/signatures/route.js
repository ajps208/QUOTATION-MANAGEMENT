import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { serializeBusiness } from '@/app/api/business/utils';

// GET /api/business/[id]/settings/signatures - Get all signatures
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const business = await Business.findById(id);
    if (!business) return Response.json({ error: 'Business not found' }, { status: 404 });
    return Response.json(business.signatures || []);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/business/[id]/settings/signatures - Replace all signatures
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { signatures } = await request.json();
    if (!Array.isArray(signatures)) {
      return Response.json({ error: 'signatures must be an array' }, { status: 400 });
    }
    const cleaned = signatures.map((s, i) => ({
      type: s.type || 'custom',
      displayName: s.displayName || s.label || '',
      image: s.image || s.dataUrl || null,
      uploadedBy: s.uploadedBy || '',
      uploadedAt: s.uploadedAt || new Date(),
      isDefault: s.isDefault || false,
      isActive: s.isActive !== undefined ? s.isActive : true,
      order: s.order !== undefined ? s.order : i,
    }));
    const business = await Business.findByIdAndUpdate(
      id,
      { $set: { signatures: cleaned } },
      { new: true, runValidators: true }
    );
    if (!business) return Response.json({ error: 'Business not found' }, { status: 404 });
    return Response.json(serializeBusiness(business));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/business/[id]/settings/signatures?signatureId=xxx - Delete a single signature
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const signatureId = searchParams.get('signatureId');
    if (!signatureId) return Response.json({ error: 'signatureId required' }, { status: 400 });
    const business = await Business.findById(id);
    if (!business) return Response.json({ error: 'Business not found' }, { status: 404 });
    business.signatures = business.signatures.filter(s => s._id.toString() !== signatureId);
    await business.save();
    return Response.json(serializeBusiness(business));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
