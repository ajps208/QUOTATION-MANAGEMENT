'use client';
import { Box, Typography } from '@mui/material';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';

function autoFlattenBusiness(biz) {
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
    };
  }
  return biz;
}

const A4_WIDTH = 794;

export default function QuotationDocument({ business, customer, quotation, settings, scale = 1, printMode = false }) {
  const flatBusiness = autoFlattenBusiness(business);
  if (!flatBusiness || !customer || !quotation) return null;

  const cfg = settings || {};
  const primaryColor = cfg.primaryColor || '#4f46e5';
  const accentColor = cfg.accentColor || '#0ea5e9';
  const fontFamily = cfg.fontFamily || 'Inter, sans-serif';
  const headerLayout = cfg.headerLayout || 'logo-left';
  const tableStyle = cfg.tableStyle || 'striped';
  const footerText = cfg.footerText || 'Thank you for your business!';
  const quotationTitle = cfg.quotationTitle || 'QUOTATION';

  const totals = calculateQuotationTotals({
    items: quotation.items || [],
    overallDiscount: quotation.overallDiscount,
    specialDiscounts: quotation.specialDiscounts || [],
    additionalCharges: quotation.additionalCharges || [],
  });

  const tableHeaderBg = primaryColor;
  const tableRowAlt = tableStyle === 'striped' ? '#f8fafc' : 'transparent';
  const tableBorder = tableStyle === 'bordered' ? `1px solid #e2e8f0` : 'none';

  const BusinessInfo = () => (
    <Box className="qd-business-info">
      {cfg.showLogo !== false && flatBusiness.logo && (
        <img
          src={flatBusiness.logo}
          alt={flatBusiness.name}
          className="qd-logo"
          style={{
            height: cfg.logoSize === 'sm' ? 40 : cfg.logoSize === 'lg' ? 80 : 56,
            objectFit: 'contain',
            marginBottom: 8,
            display: 'block',
            maxWidth: '100%',
          }}
        />
      )}
      {cfg.showBusinessInfo !== false && (
        <>
          <Typography style={{ fontFamily, fontWeight: 700, fontSize: 16, color: '#0f172a', lineHeight: 1.3 }}>
            {flatBusiness.name}
          </Typography>
          {flatBusiness.address && (
            <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.5, marginTop: 2, wordBreak: 'break-word' }}>
              {flatBusiness.address}
            </Typography>
          )}
          {(flatBusiness.city || flatBusiness.country) && (
            <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
              {[flatBusiness.city, flatBusiness.state, flatBusiness.country].filter(Boolean).join(', ')}
            </Typography>
          )}
          {flatBusiness.email && (
            <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.5, wordBreak: 'break-word' }}>
              {flatBusiness.email}
            </Typography>
          )}
          {flatBusiness.phone && (
            <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
              {flatBusiness.phone}
            </Typography>
          )}
        </>
      )}
    </Box>
  );

  const QuotationMeta = () => (
    <Box className="qd-meta" style={{ textAlign: headerLayout === 'logo-right' ? 'left' : 'right' }}>
      <Typography style={{ fontFamily, fontWeight: 700, fontSize: 26, color: primaryColor, letterSpacing: '0.04em', lineHeight: 1.2 }}>
        {quotationTitle}
      </Typography>
      {cfg.showQuotationNumber !== false && (
        <Typography style={{ fontFamily, fontSize: 12, color: '#64748b', marginTop: 8 }}>
          <span style={{ fontWeight: 600 }}>No: </span>{quotation.quotationNumber || 'DRAFT'}
        </Typography>
      )}
      {cfg.showDates !== false && (
        <>
          <Typography style={{ fontFamily, fontSize: 12, color: '#64748b' }}>
            <span style={{ fontWeight: 600 }}>Date: </span>{formatDate(quotation.quotationDate || quotation.createdAt)}
          </Typography>
          <Typography style={{ fontFamily, fontSize: 12, color: '#64748b' }}>
            <span style={{ fontWeight: 600 }}>Valid Until: </span>{formatDate(quotation.expiryDate)}
          </Typography>
        </>
      )}
    </Box>
  );

  const renderHeader = () => {
    if (headerLayout === 'centered') {
      return (
        <Box className="qd-header qd-header--centered" style={{ backgroundColor: primaryColor, padding: '24px 40px', textAlign: 'center' }}>
            {flatBusiness.logo && cfg.showLogo !== false && (
              <img src={flatBusiness.logo} alt={flatBusiness.name} className="qd-logo" style={{ height: 60, objectFit: 'contain', marginBottom: 12, display: 'inline-block', maxWidth: '100%' }} />
            )}
            <Typography style={{ fontFamily, fontWeight: 700, fontSize: 26, color: '#ffffff', letterSpacing: '0.08em' }}>
              {quotationTitle}
            </Typography>
            {cfg.showBusinessInfo !== false && (
              <Typography style={{ fontFamily, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4, wordBreak: 'break-word' }}>
                {flatBusiness.name} • {flatBusiness.email}
              </Typography>
            )}
        </Box>
      );
    }

    if (headerLayout === 'logo-right') {
      return (
        <Box className="qd-header qd-header--logo-right" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '32px 40px', borderBottom: `3px solid ${primaryColor}` }}>
          <QuotationMeta />
          <BusinessInfo />
        </Box>
      );
    }

    return (
      <Box className="qd-header qd-header--logo-left" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '32px 40px', borderBottom: `3px solid ${primaryColor}` }}>
        <BusinessInfo />
        <QuotationMeta />
      </Box>
    );
  };

  return (
    <Box
      className="qd-document"
      style={{
        fontFamily,
        backgroundColor: '#ffffff',
        width: A4_WIDTH,
        minHeight: 1123,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        boxShadow: printMode ? 'none' : '0 4px 24px rgba(0,0,0,0.12)',
        position: 'relative',
      }}
    >
      {renderHeader()}

      <Box className="qd-body" style={{ padding: '32px 40px' }}>
        {cfg.showCustomerInfo !== false && (
          <Box className="qd-from-to" style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
            <Box className="qd-from-to__box" style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 8, padding: '16px 20px', borderLeft: `4px solid ${primaryColor}`, minWidth: 0 }}>
              <Typography style={{ fontFamily, fontSize: 10, fontWeight: 700, color: primaryColor, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                From
              </Typography>
              <Typography style={{ fontFamily, fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{flatBusiness.name}</Typography>
              {flatBusiness.address && <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.5, wordBreak: 'break-word' }}>{flatBusiness.address}</Typography>}
              {(flatBusiness.city || flatBusiness.country) && <Typography style={{ fontFamily, fontSize: 12, color: '#475569' }}>{[flatBusiness.city, flatBusiness.country].filter(Boolean).join(', ')}</Typography>}
              {flatBusiness.email && <Typography style={{ fontFamily, fontSize: 12, color: '#475569', wordBreak: 'break-word' }}>{flatBusiness.email}</Typography>}
            </Box>
            <Box className="qd-from-to__box" style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 8, padding: '16px 20px', borderLeft: `4px solid ${accentColor}`, minWidth: 0 }}>
              <Typography style={{ fontFamily, fontSize: 10, fontWeight: 700, color: accentColor, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                To
              </Typography>
              <Typography style={{ fontFamily, fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{customer.name}</Typography>
              {customer.companyName && <Typography style={{ fontFamily, fontSize: 12, color: '#475569' }}>{customer.companyName}</Typography>}
              {customer.billingAddress && <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.5, wordBreak: 'break-word' }}>{customer.billingAddress}</Typography>}
              {(customer.city || customer.country) && <Typography style={{ fontFamily, fontSize: 12, color: '#475569' }}>{[customer.city, customer.country].filter(Boolean).join(', ')}</Typography>}
              {customer.email && <Typography style={{ fontFamily, fontSize: 12, color: '#475569', wordBreak: 'break-word' }}>{customer.email}</Typography>}
              {customer.taxNumber && <Typography style={{ fontFamily, fontSize: 12, color: '#475569' }}>GSTIN: {customer.taxNumber}</Typography>}
            </Box>
          </Box>
        )}

        <Box className="qd-table-wrap" style={{ marginBottom: 24, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="qd-table" style={{ width: '100%', borderCollapse: 'collapse', border: tableBorder, minWidth: 480 }}>
            <thead>
              <tr style={{ backgroundColor: tableHeaderBg }}>
                {['#', 'Item / Description', 'Qty', 'Unit Price',
                  cfg.showDiscounts !== false ? 'Discount' : null,
                  cfg.showTax !== false ? 'Tax' : null,
                  'Total'
                ].filter(Boolean).map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 14px',
                    textAlign: ['#', 'Qty', 'Unit Price', 'Discount', 'Tax', 'Total'].includes(h) && h !== 'Item / Description' ? 'right' : 'left',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                    border: tableBorder,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {totals.lineItems.map((item, i) => (
                <tr key={i} style={{ backgroundColor: tableStyle === 'striped' && i % 2 === 1 ? tableRowAlt : 'transparent', borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748b', border: tableBorder }}>{i + 1}</td>
                  <td style={{ padding: '10px 14px', border: tableBorder, wordBreak: 'break-word' }}>
                    <span style={{ fontFamily, fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{item.name}</span>
                    {item.unit && <span style={{ fontFamily, fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>({item.unit})</span>}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily, fontSize: 12, color: '#334155', border: tableBorder, whiteSpace: 'nowrap' }}>{item.quantity}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily, fontSize: 12, color: '#334155', border: tableBorder, whiteSpace: 'nowrap' }}>{formatCurrency(item.unitPrice)}</td>
                  {cfg.showDiscounts !== false && (
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily, fontSize: 12, color: item.discount > 0 ? '#10b981' : '#94a3b8', border: tableBorder, whiteSpace: 'nowrap' }}>
                      {item.discount > 0 ? `- ${formatCurrency(item.discount)}` : '—'}
                    </td>
                  )}
                  {cfg.showTax !== false && (
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily, fontSize: 12, color: '#334155', border: tableBorder, whiteSpace: 'nowrap' }}>
                      {item.taxPercent > 0 ? `${item.taxPercent}%` : '—'}
                    </td>
                  )}
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily, fontSize: 12, fontWeight: 700, color: '#0f172a', border: tableBorder, whiteSpace: 'nowrap' }}>
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        <Box className="qd-totals" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
          <Box style={{ minWidth: 280, width: '100%', maxWidth: 360 }}>
            {cfg.showSubtotal !== false && (
              <TotalsRow label="Subtotal" value={formatCurrency(totals.subtotal)} fontFamily={fontFamily} />
            )}
            {cfg.showDiscounts !== false && totals.itemDiscount > 0 && (
              <TotalsRow label="Item Discounts" value={`- ${formatCurrency(totals.itemDiscount)}`} fontFamily={fontFamily} color="#10b981" />
            )}
            {cfg.showDiscounts !== false && totals.overallDiscountAmount > 0 && (
              <TotalsRow label="Overall Discount" value={`- ${formatCurrency(totals.overallDiscountAmount)}`} fontFamily={fontFamily} color="#10b981" />
            )}
            {cfg.showDiscounts !== false && totals.specialDiscountTotal > 0 && (
              <TotalsRow label="Special Discounts" value={`- ${formatCurrency(totals.specialDiscountTotal)}`} fontFamily={fontFamily} color="#10b981" />
            )}
            {totals.chargeTotal > 0 && (
              <TotalsRow label="Additional Charges" value={formatCurrency(totals.chargeTotal)} fontFamily={fontFamily} />
            )}
            {cfg.showTax !== false && (
              <TotalsRow label="Total Tax (GST)" value={formatCurrency(totals.totalTax)} fontFamily={fontFamily} />
            )}
            <Box style={{ borderTop: `2px solid ${primaryColor}`, marginTop: 8, paddingTop: 8 }}>
              <TotalsRow
                label="Grand Total"
                value={formatCurrency(totals.grandTotal)}
                fontFamily={fontFamily}
                bold
                color={primaryColor}
                large
              />
            </Box>
          </Box>
        </Box>

        {cfg.showDiscounts !== false && totals.calculatedSpecialDiscounts?.length > 0 && (
          <Box style={{ backgroundColor: '#f0fdf4', borderRadius: 8, padding: '12px 16px', marginBottom: 24, border: '1px solid #bbf7d0' }}>
            <Typography style={{ fontFamily, fontSize: 11, fontWeight: 700, color: '#166534', marginBottom: 6 }}>Special Discounts Applied</Typography>
            {totals.calculatedSpecialDiscounts.map((d, i) => (
              <Box key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography style={{ fontFamily, fontSize: 11, color: '#166534', wordBreak: 'break-word', paddingRight: 8 }}>{d.name}</Typography>
                <Typography style={{ fontFamily, fontSize: 11, color: '#166534', whiteSpace: 'nowrap' }}>- {formatCurrency(d.amount)}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {cfg.showNotes !== false && (quotation.customerNotes || quotation.businessNotes) && (
          <Box style={{ marginBottom: 24 }}>
            <Typography style={{ fontFamily, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Notes
            </Typography>
            {quotation.customerNotes && (
              <Typography style={{ fontFamily, fontSize: 12, color: '#334155', lineHeight: 1.6, wordBreak: 'break-word' }}>{quotation.customerNotes}</Typography>
            )}
          </Box>
        )}

        {cfg.showTerms !== false && (quotation.paymentTerms || quotation.terms || cfg.defaultTerms) && (
          <Box style={{ marginBottom: 24, backgroundColor: '#f8fafc', borderRadius: 8, padding: '14px 18px', border: '1px solid #e2e8f0' }}>
            <Typography style={{ fontFamily, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Terms & Conditions
            </Typography>
            {quotation.paymentTerms && (
              <Box style={{ marginBottom: 6 }}>
                <Typography style={{ fontFamily, fontSize: 11, fontWeight: 600, color: '#334155' }}>Payment Terms:</Typography>
                <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.6, wordBreak: 'break-word' }}>{quotation.paymentTerms}</Typography>
              </Box>
            )}
            {(quotation.terms || cfg.defaultTerms) && (
              <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.6, wordBreak: 'break-word' }}>
                {quotation.terms || cfg.defaultTerms}
              </Typography>
            )}
          </Box>
        )}

        {cfg.showBankDetails && cfg.bankDetails && (
          <Box style={{ marginBottom: 24 }}>
            <Typography style={{ fontFamily, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Bank Details
            </Typography>
            <Typography style={{ fontFamily, fontSize: 12, color: '#475569', whiteSpace: 'pre-line', lineHeight: 1.6, wordBreak: 'break-word' }}>{cfg.bankDetails}</Typography>
          </Box>
        )}

        {cfg.showSignature && (
          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <Box style={{ textAlign: 'center', minWidth: 200 }}>
              {cfg.signatures && cfg.signatures.length > 0 && cfg.signatures[0].dataUrl ? (
                <img
                  src={cfg.signatures[0].dataUrl}
                  alt={cfg.signatures[0].label || 'Signature'}
                  className="qd-signature"
                  style={{ maxHeight: 64, maxWidth: 200, objectFit: 'contain', marginBottom: 6, display: 'block', marginLeft: 'auto' }}
                />
              ) : (
                <Box style={{ borderBottom: `1px solid #94a3b8`, marginBottom: 6, height: 48 }} />
              )}
              <Typography style={{ fontFamily, fontSize: 11, color: '#475569' }}>Authorised Signature</Typography>
              <Typography style={{ fontFamily, fontSize: 11, fontWeight: 600, color: '#334155' }}>{flatBusiness.name}</Typography>
            </Box>
          </Box>
        )}
      </Box>

      {cfg.showFooter !== false && (
        <Box className="qd-footer" style={{ backgroundColor: primaryColor, padding: '14px 40px', textAlign: 'center', position: 'relative', marginTop: 'auto' }}>
          <Typography style={{ fontFamily, fontSize: 12, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
            {footerText}
          </Typography>
          {flatBusiness.website && (
            <Typography style={{ fontFamily, fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2, wordBreak: 'break-word' }}>
              {flatBusiness.website}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

function TotalsRow({ label, value, fontFamily, bold, color, large }) {
  return (
    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 6 }}>
      <Typography style={{ fontFamily, fontSize: large ? 14 : 12, fontWeight: bold ? 700 : 500, color: color || '#475569' }}>
        {label}
      </Typography>
      <Typography style={{ fontFamily, fontSize: large ? 16 : 12, fontWeight: bold ? 700 : 500, color: color || '#0f172a', whiteSpace: 'nowrap' }}>
        {value}
      </Typography>
    </Box>
  );
}
