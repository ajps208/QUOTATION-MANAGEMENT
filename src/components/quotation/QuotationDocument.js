'use client';
import { Box, Typography, Divider } from '@mui/material';
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

/**
 * QuotationDocument — Reusable A4-style quotation renderer.
 *
 * Props:
 *   business     — flat or nested business object (auto-detected)
 *   customer     — object with name, companyName, billingAddress, city, email, taxNumber
 *   quotation    — quotation object with items, overallDiscount, terms, etc.
 *   settings     — quotationSettings object controlling layout, colors, visibility
 *   scale        — number (default 1). Used to scale the doc for preview thumbnails.
 *   printMode    — boolean. When true, removes shadows and renders for print/PDF.
 */
export default function QuotationDocument({ business, customer, quotation, settings, scale = 1, printMode = false }) {
  const flatBusiness = autoFlattenBusiness(business);
  if (!flatBusiness || !customer || !quotation) return null;

  const cfg = settings || {};
  const primaryColor = cfg.primaryColor || '#4f46e5';
  const accentColor = cfg.accentColor || '#0ea5e9';
  const fontFamily = cfg.fontFamily || 'Inter, sans-serif';
  const headerLayout = cfg.headerLayout || 'logo-left'; // logo-left | centered | logo-right
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

  // Business info block
  const BusinessInfo = () => (
    <Box>
      {cfg.showLogo !== false && flatBusiness.logo && (
        <img
          src={flatBusiness.logo}
          alt={flatBusiness.name}
          style={{
            height: cfg.logoSize === 'sm' ? 40 : cfg.logoSize === 'lg' ? 80 : 56,
            objectFit: 'contain',
            marginBottom: 8,
            display: 'block',
          }}
        />
      )}
      {cfg.showBusinessInfo !== false && (
        <>
          <Typography style={{ fontFamily, fontWeight: 700, fontSize: 16, color: '#0f172a', lineHeight: 1.3 }}>
            {flatBusiness.name}
          </Typography>
          {flatBusiness.address && (
            <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.5, marginTop: 2 }}>
              {flatBusiness.address}
            </Typography>
          )}
          {(flatBusiness.city || flatBusiness.country) && (
            <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
              {[flatBusiness.city, flatBusiness.state, flatBusiness.country].filter(Boolean).join(', ')}
            </Typography>
          )}
          {flatBusiness.email && (
            <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
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

  // Quotation meta block
  const QuotationMeta = () => (
    <Box style={{ textAlign: headerLayout === 'logo-right' ? 'left' : 'right' }}>
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

  // Render header based on layout style
  const renderHeader = () => {
    if (headerLayout === 'centered') {
      return (
        <Box style={{ backgroundColor: primaryColor, padding: '24px 40px', textAlign: 'center' }}>
            {flatBusiness.logo && cfg.showLogo !== false && (
              <img src={flatBusiness.logo} alt={flatBusiness.name} style={{ height: 60, objectFit: 'contain', marginBottom: 12, display: 'inline-block' }} />
            )}
            <Typography style={{ fontFamily, fontWeight: 700, fontSize: 26, color: '#ffffff', letterSpacing: '0.08em' }}>
              {quotationTitle}
            </Typography>
            {cfg.showBusinessInfo !== false && (
              <Typography style={{ fontFamily, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                {flatBusiness.name} • {flatBusiness.email}
              </Typography>
            )}
        </Box>
      );
    }

    if (headerLayout === 'logo-right') {
      return (
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '32px 40px', borderBottom: `3px solid ${primaryColor}` }}>
          <QuotationMeta />
          <BusinessInfo />
        </Box>
      );
    }

    // Default: logo-left
    return (
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '32px 40px', borderBottom: `3px solid ${primaryColor}` }}>
        <BusinessInfo />
        <QuotationMeta />
      </Box>
    );
  };

  return (
    <Box
      style={{
        fontFamily,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in px at 96dpi
        minHeight: 1123, // A4 height
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        boxShadow: printMode ? 'none' : '0 4px 24px rgba(0,0,0,0.12)',
        position: 'relative',
      }}
    >
      {/* ─── HEADER ─── */}
      {renderHeader()}

      <Box style={{ padding: '32px 40px' }}>
        {/* ─── FROM / TO ─── */}
        {cfg.showCustomerInfo !== false && (
          <Box style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
            <Box style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 8, padding: '16px 20px', borderLeft: `4px solid ${primaryColor}` }}>
              <Typography style={{ fontFamily, fontSize: 10, fontWeight: 700, color: primaryColor, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                From
              </Typography>
              <Typography style={{ fontFamily, fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{flatBusiness.name}</Typography>
              {flatBusiness.address && <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{flatBusiness.address}</Typography>}
              {(flatBusiness.city || flatBusiness.country) && <Typography style={{ fontFamily, fontSize: 12, color: '#475569' }}>{[flatBusiness.city, flatBusiness.country].filter(Boolean).join(', ')}</Typography>}
              {flatBusiness.email && <Typography style={{ fontFamily, fontSize: 12, color: '#475569' }}>{flatBusiness.email}</Typography>}
            </Box>
            <Box style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 8, padding: '16px 20px', borderLeft: `4px solid ${accentColor}` }}>
              <Typography style={{ fontFamily, fontSize: 10, fontWeight: 700, color: accentColor, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                To
              </Typography>
              <Typography style={{ fontFamily, fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{customer.name}</Typography>
              {customer.companyName && <Typography style={{ fontFamily, fontSize: 12, color: '#475569' }}>{customer.companyName}</Typography>}
              {customer.billingAddress && <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{customer.billingAddress}</Typography>}
              {(customer.city || customer.country) && <Typography style={{ fontFamily, fontSize: 12, color: '#475569' }}>{[customer.city, customer.country].filter(Boolean).join(', ')}</Typography>}
              {customer.email && <Typography style={{ fontFamily, fontSize: 12, color: '#475569' }}>{customer.email}</Typography>}
              {customer.taxNumber && <Typography style={{ fontFamily, fontSize: 12, color: '#475569' }}>GSTIN: {customer.taxNumber}</Typography>}
            </Box>
          </Box>
        )}

        {/* ─── ITEMS TABLE ─── */}
        <Box style={{ marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: tableBorder }}>
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
                  <td style={{ padding: '10px 14px', border: tableBorder }}>
                    <span style={{ fontFamily, fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{item.name}</span>
                    {item.unit && <span style={{ fontFamily, fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>({item.unit})</span>}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily, fontSize: 12, color: '#334155', border: tableBorder }}>{item.quantity}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily, fontSize: 12, color: '#334155', border: tableBorder }}>{formatCurrency(item.unitPrice)}</td>
                  {cfg.showDiscounts !== false && (
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily, fontSize: 12, color: item.discount > 0 ? '#10b981' : '#94a3b8', border: tableBorder }}>
                      {item.discount > 0 ? `- ${formatCurrency(item.discount)}` : '—'}
                    </td>
                  )}
                  {cfg.showTax !== false && (
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily, fontSize: 12, color: '#334155', border: tableBorder }}>
                      {item.taxPercent > 0 ? `${item.taxPercent}%` : '—'}
                    </td>
                  )}
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily, fontSize: 12, fontWeight: 700, color: '#0f172a', border: tableBorder }}>
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* ─── TOTALS ─── */}
        <Box style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
          <Box style={{ minWidth: 280 }}>
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

        {/* ─── SPECIAL DISCOUNTS detail ─── */}
        {cfg.showDiscounts !== false && totals.calculatedSpecialDiscounts?.length > 0 && (
          <Box style={{ backgroundColor: '#f0fdf4', borderRadius: 8, padding: '12px 16px', marginBottom: 24, border: '1px solid #bbf7d0' }}>
            <Typography style={{ fontFamily, fontSize: 11, fontWeight: 700, color: '#166534', marginBottom: 6 }}>Special Discounts Applied</Typography>
            {totals.calculatedSpecialDiscounts.map((d, i) => (
              <Box key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography style={{ fontFamily, fontSize: 11, color: '#166534' }}>{d.name}</Typography>
                <Typography style={{ fontFamily, fontSize: 11, color: '#166534' }}>- {formatCurrency(d.amount)}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* ─── NOTES ─── */}
        {cfg.showNotes !== false && (quotation.customerNotes || quotation.businessNotes) && (
          <Box style={{ marginBottom: 24 }}>
            <Typography style={{ fontFamily, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Notes
            </Typography>
            {quotation.customerNotes && (
              <Typography style={{ fontFamily, fontSize: 12, color: '#334155', lineHeight: 1.6 }}>{quotation.customerNotes}</Typography>
            )}
          </Box>
        )}

        {/* ─── TERMS ─── */}
        {cfg.showTerms !== false && (quotation.paymentTerms || quotation.terms || cfg.defaultTerms) && (
          <Box style={{ marginBottom: 24, backgroundColor: '#f8fafc', borderRadius: 8, padding: '14px 18px', border: '1px solid #e2e8f0' }}>
            <Typography style={{ fontFamily, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Terms & Conditions
            </Typography>
            {quotation.paymentTerms && (
              <Box style={{ marginBottom: 6 }}>
                <Typography style={{ fontFamily, fontSize: 11, fontWeight: 600, color: '#334155' }}>Payment Terms:</Typography>
                <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{quotation.paymentTerms}</Typography>
              </Box>
            )}
            {(quotation.terms || cfg.defaultTerms) && (
              <Typography style={{ fontFamily, fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                {quotation.terms || cfg.defaultTerms}
              </Typography>
            )}
          </Box>
        )}

        {/* ─── BANK DETAILS ─── */}
        {cfg.showBankDetails && cfg.bankDetails && (
          <Box style={{ marginBottom: 24 }}>
            <Typography style={{ fontFamily, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Bank Details
            </Typography>
            <Typography style={{ fontFamily, fontSize: 12, color: '#475569', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{cfg.bankDetails}</Typography>
          </Box>
        )}

        {/* ─── SIGNATURE ─── */}
        {cfg.showSignature && (
          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <Box style={{ textAlign: 'center', minWidth: 200 }}>
              {cfg.signatures && cfg.signatures.length > 0 && cfg.signatures[0].dataUrl ? (
                <img
                  src={cfg.signatures[0].dataUrl}
                  alt={cfg.signatures[0].label || 'Signature'}
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

      {/* ─── FOOTER ─── */}
      {cfg.showFooter !== false && (
        <Box style={{ backgroundColor: primaryColor, padding: '14px 40px', textAlign: 'center', position: 'relative', marginTop: 'auto' }}>
          <Typography style={{ fontFamily, fontSize: 12, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
            {footerText}
          </Typography>
          {flatBusiness.website && (
            <Typography style={{ fontFamily, fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
              {flatBusiness.website}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

// Helper for totals rows
function TotalsRow({ label, value, fontFamily, bold, color, large }) {
  return (
    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 6 }}>
      <Typography style={{ fontFamily, fontSize: large ? 14 : 12, fontWeight: bold ? 700 : 500, color: color || '#475569' }}>
        {label}
      </Typography>
      <Typography style={{ fontFamily, fontSize: large ? 16 : 12, fontWeight: bold ? 700 : 500, color: color || '#0f172a' }}>
        {value}
      </Typography>
    </Box>
  );
}
