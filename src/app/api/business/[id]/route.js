import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { serializeBusiness } from '@/app/api/business/utils';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const business = await Business.findById(id).lean({ virtuals: false });
    if (!business) return Response.json({ error: 'Business not found' }, { status: 404 });
    return Response.json(serializeBusiness(business));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const { id: _id, _id: __id, createdAt, updatedAt, __v, ...updateData } = data;
    const business = await Business.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).lean({ virtuals: false });
    if (!business) return Response.json({ error: 'Business not found' }, { status: 404 });
    return Response.json(serializeBusiness(business));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

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
