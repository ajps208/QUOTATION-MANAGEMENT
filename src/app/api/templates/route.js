import connectToDatabase from '@/lib/mongodb';
import QuotationTemplate from '@/models/QuotationTemplate';

const SEED_TEMPLATES = [
  {
    name: 'Modern',
    description: 'Clean, modern design with a focus on typography and whitespace.',
    primaryColor: '#2563eb',
    headerLayout: 'logo-left',
    showBusinessInfo: true,
    showCustomerInfo: true,
    showDiscounts: true,
    showTax: true,
  },
  {
    name: 'Minimal',
    description: 'Stripped back minimal design for a professional look.',
    primaryColor: '#0f172a',
    headerLayout: 'centered',
    showBusinessInfo: true,
    showCustomerInfo: true,
    showDiscounts: false,
    showTax: true,
  },
  {
    name: 'Corporate',
    description: 'Traditional corporate layout, detailed table structures.',
    primaryColor: '#0369a1',
    headerLayout: 'logo-right',
    showBusinessInfo: true,
    showCustomerInfo: true,
    showDiscounts: true,
    showTax: true,
  },
  {
    name: 'Professional',
    description: 'Balanced layout suitable for all industries.',
    primaryColor: '#4f46e5',
    headerLayout: 'logo-left',
    showBusinessInfo: true,
    showCustomerInfo: true,
    showDiscounts: true,
    showTax: true,
  },
];

function serialize(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

// GET /api/templates
export async function GET() {
  try {
    await connectToDatabase();
    let templates = await QuotationTemplate.find().sort({ createdAt: 1 });

    // Seed if empty
    if (templates.length === 0) {
      await QuotationTemplate.insertMany(SEED_TEMPLATES);
      templates = await QuotationTemplate.find().sort({ createdAt: 1 });
    }

    return Response.json(templates.map(serialize));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
