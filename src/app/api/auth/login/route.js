import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Business from '@/models/Business';
import QuotationSetting from '@/models/QuotationSetting';

// POST /api/auth/login
export async function POST(request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    // Convert _id to id for compatibility
    userWithoutPassword.id = userObj._id.toString();
    if (userWithoutPassword.businessId) {
      userWithoutPassword.businessId = userWithoutPassword.businessId.toString();
    }

    return Response.json(userWithoutPassword);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
