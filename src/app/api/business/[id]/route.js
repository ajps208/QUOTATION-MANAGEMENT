import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';

function serializeBusiness(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  if (obj.categories) obj.categories = obj.categories.map(c => c.toString());
  return obj;
}

// GET /api/business/[id]
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const business = await Business.findById(id);
    if (!business) return Response.json({ error: 'Business not found' }, { status: 404 });
    return Response.json(serializeBusiness(business));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/business/[id]
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const business = await Business.findByIdAndUpdate(id, data, { new: true });
    if (!business) return Response.json({ error: 'Business not found' }, { status: 404 });
    return Response.json(serializeBusiness(business));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/business/[id]
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Business.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
