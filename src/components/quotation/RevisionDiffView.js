'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Card, CardContent, Chip, Collapse, IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { quotationService } from '@/services/quotationService';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';

const FIELD_LABELS = {
  quotationNumber: 'Quotation Number',
  quotationDate: 'Quotation Date',
  expiryDate: 'Expiry Date',
  currency: 'Currency',
  items: 'Line Items',
  overallDiscount: 'Overall Discount',
  specialDiscounts: 'Special Discounts',
  additionalCharges: 'Additional Charges',
  paymentTerms: 'Payment Terms',
  terms: 'Terms & Conditions',
  businessNotes: 'Business Notes',
  customerNotes: 'Customer Notes',
  status: 'Status',
  rejectionReason: 'Rejection Reason',
  revision: 'Revision',
  allowedCustomerEdit: 'Customer Edit Allowed',
};

function getValueLabel(field, value) {
  if (value === null || value === undefined) return '—';
  if (field === 'items' && Array.isArray(value)) {
    return value.map(item => `${item.name} (x${item.quantity})`).join(', ');
  }
  if (field === 'expiryDate' || field === 'quotationDate') {
    return formatDate(value);
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function RevisionDiffView({ quotationId, refreshKey }) {
  const [current, setCurrent] = useState(null);
  const [previousRevision, setPreviousRevision] = useState(null);
  const [changedFields, setChangedFields] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const initRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quotData, revisions] = await Promise.all([
        quotationService.getQuotationById(quotationId),
        quotationService.getRevisions(quotationId),
      ]);
      setCurrent(quotData);

      if (revisions.length > 0) {
        const latest = revisions[0];
        setPreviousRevision(latest);

        const changed = [];
        const snapshot = latest.quotationSnapshot;
        if (snapshot) {
          for (const key of Object.keys(snapshot)) {
            if (key === '_id' || key === 'revision' || key === 'status') continue;
            const oldVal = JSON.stringify(snapshot[key]);
            const newVal = JSON.stringify(quotData[key]);
            if (oldVal !== newVal) {
              changed.push(key);
            }
          }
        }
        setChangedFields(changed);
      } else {
        setPreviousRevision(null);
        setChangedFields([]);
      }
    } catch {
      // silent fail for diff view
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quotationId && (!initRef.current || refreshKey > 0)) {
      initRef.current = true;
      fetchData();
    }
  }, [quotationId, refreshKey]);

  if (loading) {
    return <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>Loading changes...</Typography>;
  }

  if (!previousRevision || changedFields.length === 0) {
    return null;
  }

  const snapshot = previousRevision.quotationSnapshot;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Changes from Revision {previousRevision.revisionNumber}
        </Typography>
        <Chip label={`${changedFields.length} field(s) changed`} size="small" color="warning" variant="outlined" />
        <IconButton size="small" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Typography variant="caption" color="text.secondary">
          {formatDateTime(previousRevision.createdAt)}
        </Typography>
      </Box>

      <Collapse in={expanded}>
        <Card variant="outlined">
          <CardContent sx={{ py: 2, px: 2, '&:last-child': { pb: 2 } }}>
            {changedFields.map((field) => (
              <Box key={field} sx={{ mb: 2, p: 1.5, bgcolor: 'warning.light', borderRadius: 1, borderLeft: '3px solid', borderColor: 'warning.main' }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  {FIELD_LABELS[field] || field}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: 150 }}>
                    <Typography variant="caption" color="error.main" fontWeight={500}>Previous:</Typography>
                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                      {getValueLabel(field, snapshot?.[field])}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 150 }}>
                    <Typography variant="caption" color="success.main" fontWeight={500}>Current:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {getValueLabel(field, current?.[field])}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}

            {previousRevision.remarks && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" fontWeight={600}>Submitted remarks:</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 0.25 }}>
                  {previousRevision.remarks}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Collapse>
    </Box>
  );
}
