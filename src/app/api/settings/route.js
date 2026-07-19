import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import QuotationSetting from '@/models/QuotationSetting';

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
  signatures: [],
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

function buildSettingsFromBusiness(biz) {
  const qs = biz.quotationSettings || {};
  const branding = biz.branding || {};
  return {
    templateId: qs.templateId?.toString() || null,
    primaryColor: branding.primaryColor || DEFAULT_SETTINGS.primaryColor,
    accentColor: branding.secondaryColor || DEFAULT_SETTINGS.accentColor,
    fontFamily: branding.defaultFont || DEFAULT_SETTINGS.fontFamily,
    fontSize: qs.fontSize || DEFAULT_SETTINGS.fontSize,
    quotationTitle: qs.quotationTitle || DEFAULT_SETTINGS.quotationTitle,
    headerLayout: qs.headerLayout || DEFAULT_SETTINGS.headerLayout,
    logoSize: qs.logoSize || DEFAULT_SETTINGS.logoSize,
    showLogo: qs.showLogo !== undefined ? qs.showLogo : DEFAULT_SETTINGS.showLogo,
    showBusinessInfo: qs.showBusinessInfo !== undefined ? qs.showBusinessInfo : DEFAULT_SETTINGS.showBusinessInfo,
    showCustomerInfo: qs.showCustomerInfo !== undefined ? qs.showCustomerInfo : DEFAULT_SETTINGS.showCustomerInfo,
    showQuotationNumber: qs.showQuotationNumber !== undefined ? qs.showQuotationNumber : DEFAULT_SETTINGS.showQuotationNumber,
    showDates: qs.showDates !== undefined ? qs.showDates : DEFAULT_SETTINGS.showDates,
    showDiscounts: qs.showDiscounts !== undefined ? qs.showDiscounts : DEFAULT_SETTINGS.showDiscounts,
    showTax: qs.showTax !== undefined ? qs.showTax : DEFAULT_SETTINGS.showTax,
    showSubtotal: qs.showSubtotal !== undefined ? qs.showSubtotal : DEFAULT_SETTINGS.showSubtotal,
    showItemNotes: qs.showItemNotes || DEFAULT_SETTINGS.showItemNotes,
    showTerms: qs.showTerms !== undefined ? qs.showTerms : DEFAULT_SETTINGS.showTerms,
    showNotes: qs.showNotes !== undefined ? qs.showNotes : DEFAULT_SETTINGS.showNotes,
    showSignature: qs.showSignature || DEFAULT_SETTINGS.showSignature,
    showBankDetails: qs.showBankDetails || DEFAULT_SETTINGS.showBankDetails,
    showFooter: qs.showFooter !== undefined ? qs.showFooter : DEFAULT_SETTINGS.showFooter,
    tableStyle: qs.tableStyle || DEFAULT_SETTINGS.tableStyle,
    footerText: qs.footerText || DEFAULT_SETTINGS.footerText,
    bankDetails: qs.bankDetails || DEFAULT_SETTINGS.bankDetails,
    defaultTerms: qs.defaultTerms || DEFAULT_SETTINGS.defaultTerms,
    quotationPrefix: qs.quotationPrefix || DEFAULT_SETTINGS.quotationPrefix,
    dateFormat: qs.dateFormat || DEFAULT_SETTINGS.dateFormat,
    signatures: (biz.signatures || [])
      .filter(s => s.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(s => ({ id: s._id?.toString(), label: s.displayName, type: s.type, dataUrl: s.image })),
  };
}

// GET /api/settings?businessId=xxx
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    if (!businessId) return Response.json({ error: 'businessId required' }, { status: 400 });

    // Try reading from the Business model first (new nested schema)
    const business = await Business.findById(businessId);
    if (business && business.quotationSettings) {
      const settings = buildSettingsFromBusiness(business);
      return Response.json({ id: businessId, businessId, ...settings });
    }

    // Fallback to legacy QuotationSetting model
    let settings = await QuotationSetting.findOne({ businessId });
    if (!settings) {
      settings = await QuotationSetting.create({ businessId, ...DEFAULT_SETTINGS });
    }
    return Response.json(serialize(settings));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/settings - upsert (backward compatible)
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const { businessId, ...rest } = data;
    if (!businessId) return Response.json({ error: 'businessId required' }, { status: 400 });

    const { id, _id, createdAt, updatedAt, __v, signatures, ...updateData } = rest;

    // Update the Business model (new nested schema)
    const business = await Business.findById(businessId);
    if (business) {
      const brandingUpdate = {};
      if (updateData.primaryColor) brandingUpdate.primaryColor = updateData.primaryColor;
      if (updateData.accentColor) brandingUpdate.secondaryColor = updateData.accentColor;
      if (updateData.fontFamily) brandingUpdate.defaultFont = updateData.fontFamily;

      const allowedQsFields = [
        'templateId', 'quotationPrefix', 'currency', 'taxPercent', 'validityDays',
        'paymentTerms', 'defaultTerms', 'bankDetails', 'footerText', 'quotationTitle',
        'dateFormat', 'headerLayout', 'tableStyle', 'fontSize', 'logoSize',
        'showLogo', 'showBusinessInfo', 'showCustomerInfo', 'showQuotationNumber',
        'showDates', 'showDiscounts', 'showTax', 'showSubtotal', 'showItemNotes',
        'showTerms', 'showNotes', 'showSignature', 'showBankDetails', 'showFooter',
      ];

      const qsSet = {};
      for (const key of allowedQsFields) {
        if (updateData[key] !== undefined) {
          qsSet[`quotationSettings.${key}`] = updateData[key];
        }
      }

      if (Object.keys(brandingUpdate).length > 0) {
        const brandingSet = {};
        for (const [k, v] of Object.entries(brandingUpdate)) {
          brandingSet[`branding.${k}`] = v;
        }
        await Business.findByIdAndUpdate(businessId, { $set: brandingSet });
      }
      if (Object.keys(qsSet).length > 0) {
        await Business.findByIdAndUpdate(businessId, { $set: qsSet });
      }

      const updatedBiz = await Business.findById(businessId);
      const settings = buildSettingsFromBusiness(updatedBiz);
      return Response.json({ id: businessId, businessId, ...settings });
    }

    // Fallback: legacy QuotationSetting model
    const allowedLegacy = { ...updateData };
    delete allowedLegacy.signatures;
    const settings = await QuotationSetting.findOneAndUpdate(
      { businessId },
      { $set: allowedLegacy },
      { new: true, upsert: true }
    );
    return Response.json(serialize(settings));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
