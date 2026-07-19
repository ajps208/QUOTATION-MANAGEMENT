import connectToDatabase from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { serialize, toId } from '@/app/api/utils/serializer';

const toCustomer = (doc) => serialize(doc, { businessId: toId });

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const query = businessId ? { businessId } : {};
    const customers = await Customer.find(query).select('businessId name companyName email phone alternativePhone taxNumber billingAddress shippingAddress city state country postalCode notes status createdAt').lean({ virtuals: false });
    return Response.json(customers.map(toCustomer));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const customer = await Customer.create(data);
    return Response.json(toCustomer(customer), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
