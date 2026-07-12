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

// PUT /api/notifications/[id] - mark as read
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!notification) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(serialize(notification));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
