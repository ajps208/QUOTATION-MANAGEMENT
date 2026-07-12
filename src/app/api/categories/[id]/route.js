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

// GET /api/categories/[id]
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) return Response.json({ error: 'Category not found' }, { status: 404 });
    return Response.json(serialize(category));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/categories/[id]
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    if (!category) return Response.json({ error: 'Category not found' }, { status: 404 });
    return Response.json(serialize(category));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/categories/[id]
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
