import connectToDatabase from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { serialize, toId } from '@/app/api/utils/serializer';

const toNotification = (doc) => serialize(doc, { userId: toId });

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true }).lean({ virtuals: false });
    if (!notification) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(toNotification(notification));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
