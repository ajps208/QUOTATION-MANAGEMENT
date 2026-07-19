import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Business from '@/models/Business';
import QuotationSetting from '@/models/QuotationSetting';
import { USER_ROLES } from '@/constants/roles';

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    const existing = await User.findOne({ email: data.email }).select('_id').lean({ virtuals: false });
    if (existing) {
      return Response.json({ error: 'Email already exists' }, { status: 409 });
    }

    const avatar = data.name ? data.name.substring(0, 2).toUpperCase() : 'U';
    let businessId = null;

    if (data.role === USER_ROLES.BUSINESS) {
      const newBusiness = await Business.create({
        profile: {
          businessName: data.businessName || data.company || data.name,
          businessType: '',
          industry: data.industry || '',
          description: '',
        },
        contact: {
          email: data.email,
          phone: data.phone || '',
          mobile: '',
          whatsapp: '',
          website: '',
        },
        address: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          district: '',
          state: '',
          country: 'India',
          postalCode: '',
        },
        owner: {
          ownerName: data.name,
          designation: '',
          email: data.email,
          phone: data.phone || '',
        },
        branding: {
          logo: null,
          seal: null,
          primaryColor: '#4f46e5',
          secondaryColor: '#0ea5e9',
          accentColor: '#10b981',
          defaultFont: 'Inter, sans-serif',
          tagline: '',
        },
        signatures: [],
        quotationSettings: {
          quotationPrefix: 'QT',
          currency: 'INR',
          taxPercent: 18,
          validityDays: 30,
          paymentTerms: '',
          defaultTerms: 'Valid for 30 days.',
          bankDetails: '',
          footerText: 'Thank you for your business!',
          quotationTitle: 'QUOTATION',
          dateFormat: 'DD MMM YYYY',
          headerLayout: 'logo-left',
          tableStyle: 'striped',
          fontSize: 'md',
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
        },
        preferences: {
          language: 'en',
          timezone: 'Asia/Kolkata',
          dateFormat: 'DD MMM YYYY',
          numberFormat: 'en-IN',
          emailNotifications: true,
          autoSave: true,
        },
        socialLinks: {
          facebook: '',
          instagram: '',
          linkedin: '',
          twitter: '',
          youtube: '',
        },
      });
      businessId = newBusiness._id;

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
        signatures: [],
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
    delete userWithoutPassword._id;
    if (userWithoutPassword.businessId) {
      userWithoutPassword.businessId = userWithoutPassword.businessId.toString();
    }

    return Response.json(userWithoutPassword, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
