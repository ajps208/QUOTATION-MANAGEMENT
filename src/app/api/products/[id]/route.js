import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { serialize, toId } from '@/app/api/utils/serializer';

const toProduct = (doc) => serialize(doc, { businessId: toId, categoryId: toId });

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const product = await Product.findById(id).lean({ virtuals: false });
    if (!product) return Response.json({ error: 'Product not found' }, { status: 404 });
    return Response.json(toProduct(product));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const product = await Product.findByIdAndUpdate(id, data, { new: true }).lean({ virtuals: false });
    if (!product) return Response.json({ error: 'Product not found' }, { status: 404 });
    return Response.json(toProduct(product));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

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
