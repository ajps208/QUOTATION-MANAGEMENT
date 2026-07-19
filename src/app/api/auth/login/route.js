import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    const user = await User.findOne({ email }).select('name email password role phone company avatar bio businessId').lean({ virtuals: false });
    if (!user || user.password !== password) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    userWithoutPassword.id = userWithoutPassword._id.toString();
    delete userWithoutPassword._id;
    if (userWithoutPassword.businessId) {
      userWithoutPassword.businessId = userWithoutPassword.businessId.toString();
    }

    return Response.json(userWithoutPassword);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
