export function serializeBusiness(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  if (obj.categories) obj.categories = obj.categories.map(c => c.toString());
  if (obj.quotationSettings?.templateId) {
    obj.quotationSettings.templateId = obj.quotationSettings.templateId.toString();
  }
  return obj;
}

export function flattenBusinessForDocument(biz) {
  if (!biz) return null;
  const profile = biz.profile || {};
  const contact = biz.contact || {};
  const address = biz.address || {};
  const branding = biz.branding || {};
  return {
    id: biz.id || biz._id?.toString(),
    name: profile.businessName || biz.name || '',
    logo: branding.logo || biz.logo || null,
    email: contact.email || biz.email || '',
    phone: contact.phone || biz.phone || '',
    website: contact.website || biz.website || '',
    address: address.addressLine1 || biz.address || '',
    city: address.city || biz.city || '',
    state: address.state || biz.state || '',
    country: address.country || biz.country || 'India',
    postalCode: address.postalCode || biz.postalCode || '',
  };
}

export function flattenQuotationSettingsForDocument(biz) {
  if (!biz) return null;
  const qs = biz.quotationSettings || {};
  const branding = biz.branding || {};
  return {
    primaryColor: branding.primaryColor || qs.primaryColor || '#4f46e5',
    accentColor: branding.secondaryColor || qs.accentColor || '#0ea5e9',
    fontFamily: branding.defaultFont || qs.fontFamily || 'Inter, sans-serif',
    fontSize: qs.fontSize || 'md',
    quotationTitle: qs.quotationTitle || 'QUOTATION',
    headerLayout: qs.headerLayout || 'logo-left',
    logoSize: qs.logoSize || 'md',
    showLogo: qs.showLogo !== undefined ? qs.showLogo : true,
    showBusinessInfo: qs.showBusinessInfo !== undefined ? qs.showBusinessInfo : true,
    showCustomerInfo: qs.showCustomerInfo !== undefined ? qs.showCustomerInfo : true,
    showQuotationNumber: qs.showQuotationNumber !== undefined ? qs.showQuotationNumber : true,
    showDates: qs.showDates !== undefined ? qs.showDates : true,
    showDiscounts: qs.showDiscounts !== undefined ? qs.showDiscounts : true,
    showTax: qs.showTax !== undefined ? qs.showTax : true,
    showSubtotal: qs.showSubtotal !== undefined ? qs.showSubtotal : true,
    showItemNotes: qs.showItemNotes || false,
    showTerms: qs.showTerms !== undefined ? qs.showTerms : true,
    showNotes: qs.showNotes !== undefined ? qs.showNotes : true,
    showSignature: qs.showSignature || false,
    showBankDetails: qs.showBankDetails || false,
    showFooter: qs.showFooter !== undefined ? qs.showFooter : true,
    tableStyle: qs.tableStyle || 'striped',
    footerText: qs.footerText || 'Thank you for your business!',
    bankDetails: qs.bankDetails || '',
    defaultTerms: qs.defaultTerms || 'Valid for 30 days.',
    signatures: (biz.signatures || [])
      .filter(s => s.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(s => ({ id: s._id?.toString(), label: s.displayName, type: s.type, dataUrl: s.image })),
  };
}
