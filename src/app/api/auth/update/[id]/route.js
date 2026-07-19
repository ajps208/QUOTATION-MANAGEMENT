import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Business from '@/models/Business';

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const updates = await request.json();

    delete updates.password;

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password').lean({ virtuals: false });
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    user.id = user._id.toString();
    delete user._id;
    if (user.businessId) user.businessId = user.businessId.toString();

    return Response.json(user);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
