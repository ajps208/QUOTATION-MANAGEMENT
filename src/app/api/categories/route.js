import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import { serialize, toId } from '@/app/api/utils/serializer';

const toCategory = (doc) => serialize(doc, { businessId: toId });

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const query = businessId ? { businessId } : {};
    const categories = await Category.find(query).select('businessId name description image status createdAt').lean({ virtuals: false });
    return Response.json(categories.map(toCategory));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const category = await Category.create(data);
    return Response.json(toCategory(category), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
