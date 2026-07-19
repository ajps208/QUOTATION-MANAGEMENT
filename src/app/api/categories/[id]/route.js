import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import { serialize, toId } from '@/app/api/utils/serializer';

const toCategory = (doc) => serialize(doc, { businessId: toId });

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const category = await Category.findById(id).lean({ virtuals: false });
    if (!category) return Response.json({ error: 'Category not found' }, { status: 404 });
    return Response.json(toCategory(category));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const category = await Category.findByIdAndUpdate(id, data, { new: true }).lean({ virtuals: false });
    if (!category) return Response.json({ error: 'Category not found' }, { status: 404 });
    return Response.json(toCategory(category));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Category.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
