import connectToDatabase from '@/lib/mongodb';
import Notification from '@/models/Notification';

function serialize(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  obj.userId = obj.userId?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

// GET /api/notifications?userId=xxx
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const query = userId ? { userId } : {};
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    return Response.json(notifications.map(serialize));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/notifications - mark all read or create
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    // If markAllRead, update by userId
    if (data.markAllRead && data.userId) {
      await Notification.updateMany({ userId: data.userId }, { read: true });
      return Response.json({ success: true });
    }

    // Otherwise create a notification
    const notification = await Notification.create(data);
    return Response.json(serialize(notification), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
