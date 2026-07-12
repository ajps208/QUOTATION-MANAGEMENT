import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';

function serialize(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  obj.businessId = obj.businessId?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

// GET /api/categories?businessId=xxx
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const query = businessId ? { businessId } : {};
    const categories = await Category.find(query).sort({ createdAt: -1 });
    return Response.json(categories.map(serialize));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const category = await Category.create(data);
    return Response.json(serialize(category), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
