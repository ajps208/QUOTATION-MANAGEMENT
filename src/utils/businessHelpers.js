export function flattenBusiness(biz) {
  if (!biz) return null;

  if (biz.profile) {
    return {
      id: biz.id,
      name: biz.profile.businessName || '',
      logo: biz.branding?.logo || null,
      email: biz.contact?.email || '',
      phone: biz.contact?.phone || '',
      website: biz.contact?.website || '',
      address: biz.address?.addressLine1 || '',
      city: biz.address?.city || '',
      state: biz.address?.state || '',
      country: biz.address?.country || 'India',
      postalCode: biz.address?.postalCode || '',
      description: biz.profile.description || '',
      industry: biz.profile.industry || '',
      type: biz.profile.businessType || '',
      categories: biz.categories || [],
      status: biz.status,
    };
  }

  return {
    id: biz.id,
    name: biz.name || '',
    logo: biz.logo || null,
    email: biz.email || '',
    phone: biz.phone || '',
    website: biz.website || '',
    address: biz.address || '',
    city: biz.city || '',
    state: biz.state || '',
    country: biz.country || 'India',
    postalCode: biz.postalCode || '',
    description: biz.description || '',
    industry: biz.industry || '',
    type: biz.type || '',
    categories: biz.categories || [],
    status: biz.status,
  };
}

export function flattenQuotationSettings(biz) {
  if (!biz) return null;

  const qs = biz.quotationSettings || {};
  const branding = biz.branding || {};

  if (biz.profile) {
    return {
      primaryColor: branding.primaryColor || '#4f46e5',
      accentColor: branding.secondaryColor || '#0ea5e9',
      fontFamily: branding.defaultFont || 'Inter, sans-serif',
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
      quotationPrefix: qs.quotationPrefix || 'QT',
      dateFormat: qs.dateFormat || 'DD MMM YYYY',
      signatures: (biz.signatures || [])
        .filter(s => s.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(s => ({ id: s._id?.toString(), label: s.displayName, type: s.type, dataUrl: s.image })),
    };
  }

  return null;
}
