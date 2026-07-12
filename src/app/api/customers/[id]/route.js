import connectToDatabase from '@/lib/mongodb';
import Customer from '@/models/Customer';

function serialize(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  obj.businessId = obj.businessId?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

// GET /api/customers/[id]
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const customer = await Customer.findById(id);
    if (!customer) return Response.json({ error: 'Customer not found' }, { status: 404 });
    return Response.json(serialize(customer));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/customers/[id]
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const customer = await Customer.findByIdAndUpdate(id, data, { new: true });
    if (!customer) return Response.json({ error: 'Customer not found' }, { status: 404 });
    return Response.json(serialize(customer));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/customers/[id]
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Customer.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
