import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';

function serialize(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  obj.businessId = obj.businessId?.toString();
  obj.userId = obj.userId?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

// GET /api/activities?businessId=xxx
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const query = businessId ? { businessId } : {};
    const activities = await Activity.find(query).sort({ createdAt: -1 }).limit(20);
    return Response.json(activities.map(serialize));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/activities
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const activity = await Activity.create(data);
    return Response.json(serialize(activity), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
