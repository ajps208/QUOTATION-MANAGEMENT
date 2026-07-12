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

// GET /api/business - Get all businesses
export async function GET() {
  try {
    await connectToDatabase();
    const businesses = await Business.find().sort({ createdAt: -1 });
    return Response.json(businesses.map(serializeBusiness));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/business - Create a business
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
