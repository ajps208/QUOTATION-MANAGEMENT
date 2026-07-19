import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { serialize, toId } from '@/app/api/utils/serializer';

const toProduct = (doc) => serialize(doc, { businessId: toId, categoryId: toId });

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const query = businessId ? { businessId } : {};
    const products = await Product.find(query).select('businessId categoryId name code sku image imageMeta description unit basePrice taxPercent discount minQuantity type status createdAt').lean({ virtuals: false });
    return Response.json(products.map(toProduct));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const product = await Product.create(data);
    return Response.json(toProduct(product), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
