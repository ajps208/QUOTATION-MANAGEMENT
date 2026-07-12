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

// GET /api/products/[id]
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return Response.json({ error: 'Product not found' }, { status: 404 });
    return Response.json(serialize(product));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/products/[id]
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!product) return Response.json({ error: 'Product not found' }, { status: 404 });
    return Response.json(serialize(product));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
