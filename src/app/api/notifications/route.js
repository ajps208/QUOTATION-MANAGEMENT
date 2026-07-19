import connectToDatabase from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { serialize, toId } from '@/app/api/utils/serializer';

const toNotification = (doc) => serialize(doc, { userId: toId });

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const query = userId ? { userId } : {};
    const notifications = await Notification.find(query).select('userId title message read link createdAt').sort({ createdAt: -1 }).limit(50).lean({ virtuals: false });
    return Response.json(notifications.map(toNotification));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    if (data.markAllRead && data.userId) {
      await Notification.updateMany({ userId: data.userId, read: false }, { read: true });
      return Response.json({ success: true });
    }

    const notification = await Notification.create(data);
    return Response.json(toNotification(notification), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
