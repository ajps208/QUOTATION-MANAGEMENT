import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

function serialize(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  obj.businessId = obj.businessId?.toString();
  obj.categoryId = obj.categoryId?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

// GET /api/products?businessId=xxx
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const query = businessId ? { businessId } : {};
    const products = await Product.find(query).sort({ createdAt: -1 });
    return Response.json(products.map(serialize));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const product = await Product.create(data);
    return Response.json(serialize(product), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
