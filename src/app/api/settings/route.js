import connectToDatabase from '@/lib/mongodb';
import QuotationSetting from '@/models/QuotationSetting';
import QuotationTemplate from '@/models/QuotationTemplate';

const DEFAULT_SETTINGS = {
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
};

function serialize(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  obj.businessId = obj.businessId?.toString();
  obj.templateId = obj.templateId?.toString() || null;
  delete obj._id;
  delete obj.__v;
  return obj;
}

// GET /api/settings?businessId=xxx
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    if (!businessId) return Response.json({ error: 'businessId required' }, { status: 400 });

    let settings = await QuotationSetting.findOne({ businessId });
    if (!settings) {
      // Auto-create default settings
      settings = await QuotationSetting.create({ businessId, ...DEFAULT_SETTINGS });
    }
    return Response.json(serialize(settings));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/settings - upsert
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const { businessId, ...rest } = data;
    if (!businessId) return Response.json({ error: 'businessId required' }, { status: 400 });

    const settings = await QuotationSetting.findOneAndUpdate(
      { businessId },
      { ...rest },
      { new: true, upsert: true }
    );
    return Response.json(serialize(settings));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
