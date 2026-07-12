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

// GET /api/customers?businessId=xxx
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const query = businessId ? { businessId } : {};
    const customers = await Customer.find(query).sort({ createdAt: -1 });
    return Response.json(customers.map(serialize));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/customers
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const customer = await Customer.create(data);
    return Response.json(serialize(customer), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
