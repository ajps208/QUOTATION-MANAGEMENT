import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { serializeBusiness } from './utils';

export async function GET() {
  try {
    await connectToDatabase();
    const businesses = await Business.find().select('profile contact address owner branding status categories createdAt').lean({ virtuals: false });
    return Response.json(businesses.map(serializeBusiness));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const business = await Business.create(data);
    return Response.json(serializeBusiness(business), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
