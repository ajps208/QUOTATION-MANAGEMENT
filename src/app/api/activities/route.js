import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { serialize, toId } from '@/app/api/utils/serializer';

const toActivity = (doc) => serialize(doc, { businessId: toId, userId: toId });

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const query = businessId ? { businessId } : {};
    const activities = await Activity.find(query).select('businessId action userId userName role date details createdAt').sort({ createdAt: -1 }).limit(20).lean({ virtuals: false });
    return Response.json(activities.map(toActivity));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const activity = await Activity.create(data);
    return Response.json(toActivity(activity), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
