import connectToDatabase from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { serialize, toId } from '@/app/api/utils/serializer';

const toCustomer = (doc) => serialize(doc, { businessId: toId });

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const customer = await Customer.findById(id).lean({ virtuals: false });
    if (!customer) return Response.json({ error: 'Customer not found' }, { status: 404 });
    return Response.json(toCustomer(customer));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const customer = await Customer.findByIdAndUpdate(id, data, { new: true }).lean({ virtuals: false });
    if (!customer) return Response.json({ error: 'Customer not found' }, { status: 404 });
    return Response.json(toCustomer(customer));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

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
