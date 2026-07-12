import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// PUT /api/auth/update/[id]
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const updates = await request.json();

    // Don't allow password change via this route
    delete updates.password;

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    const userObj = user.toObject();
    userObj.id = userObj._id.toString();
    if (userObj.businessId) userObj.businessId = userObj.businessId.toString();

    return Response.json(userObj);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
