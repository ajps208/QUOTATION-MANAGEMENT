import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Business from '@/models/Business';
import QuotationSetting from '@/models/QuotationSetting';
import { USER_ROLES } from '@/constants/roles';

// POST /api/auth/register
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return Response.json({ error: 'Email already exists' }, { status: 409 });
    }

    const avatar = data.name ? data.name.substring(0, 2).toUpperCase() : 'U';

    let businessId = null;

    // If registering as a business, create the business record too
    if (data.role === USER_ROLES.BUSINESS) {
      const newBusiness = await Business.create({
        name: data.businessName || data.company || data.name,
        ownerName: data.name,
        email: data.email,
        phone: data.phone || '',
        currency: 'INR',
        taxPercent: 18,
        quotationPrefix: 'QT',
        validityDays: 30,
        industry: data.industry || '',
      });
      businessId = newBusiness._id;

      // Create default quotation settings for the business
      await QuotationSetting.create({
        businessId: newBusiness._id,
        templateId: null,
        primaryColor: '#4f46e5',
        accentColor: '#0ea5e9',
        fontFamily: 'Inter, sans-serif',
        fontSize: 'md',
        quotationTitle: 'QUOTATION',
        headerLayout: 'logo-left',
        logoSize: 'md',
        showLogo: true,
        showBusinessInfo: true,
        showCustomerInfo: true,
        showQuotationNumber: true,
        showDates: true,
        showDiscounts: true,
        showTax: true,
        showSubtotal: true,
        showItemNotes: false,
        showTerms: true,
        showNotes: true,
        showSignature: false,
        showBankDetails: false,
        showFooter: true,
        tableStyle: 'striped',
        footerText: 'Thank you for your business!',
        bankDetails: '',
        defaultTerms: 'Valid for 30 days.',
        quotationPrefix: 'QT',
        dateFormat: 'DD MMM YYYY',
      });
    }

    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || USER_ROLES.CUSTOMER,
      phone: data.phone || '',
      company: data.company || data.businessName || '',
      avatar,
      bio: data.bio || '',
      businessId,
    });

    const userObj = newUser.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    userWithoutPassword.id = userObj._id.toString();
    if (userWithoutPassword.businessId) {
      userWithoutPassword.businessId = userWithoutPassword.businessId.toString();
    }

    return Response.json(userWithoutPassword, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
