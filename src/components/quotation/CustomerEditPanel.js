'use client';

import { useState, useRef } from 'react';
import {
  Box, Typography, TextField, Button, IconButton, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Alert, Tooltip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';

import { formatCurrency } from '@/utils/formatters';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';

let _editKeyCounter = 0;
function nextEditKey() {
  return `edit-${++_editKeyCounter}`;
}

export default function CustomerEditPanel({ quotation, onSave, onCancel, saving }) {
  const [items, setItems] = useState(
    () => (quotation.items || []).map(item => ({
      ...item,
      _key: item._id || nextEditKey(),
    }))
  );
  const [customerNotes, setCustomerNotes] = useState(quotation.customerNotes || '');
  const [expiryDate, setExpiryDate] = useState(
    quotation.expiryDate ? new Date(quotation.expiryDate).toISOString().split('T')[0] : ''
  );
  const [remarks, setRemarks] = useState('');
  const allowedCustomerEdit = quotation.allowedCustomerEdit;

  const totals = calculateQuotationTotals({ ...quotation, items });

  const handleItemChange = (index, field, value) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== index) return item;
      if (field === 'quantity') {
        return { ...item, [field]: Math.max(1, Number(value) || 1) };
      }
      return item;
    }));
  };

  const handleSubmit = () => {
    const payload = {
      items: items.map(({ _key, ...rest }) => rest),
      customerNotes,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      remarks: remarks.trim(),
    };
    onSave(payload);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Alert severity="info" sx={{ mb: 2 }}>
        You can edit quantities, notes, and expiry date. Pricing, taxes, and discounts are controlled by the business.
      </Alert>

      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Line Items</Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right" sx={{ minWidth: 80 }}>Qty</TableCell>
              {!allowedCustomerEdit && (
                <TableCell align="right" sx={{ minWidth: 100 }}>Unit Price</TableCell>
              )}
              {!allowedCustomerEdit && (
                <TableCell align="right" sx={{ minWidth: 80 }}>Tax %</TableCell>
              )}
              <TableCell align="right" sx={{ minWidth: 100 }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={item._key || idx}>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
                </TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    slotProps={{ htmlInput: { min: 1, style: { textAlign: 'right', width: 60 } } }}
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                  />
                </TableCell>
                {!allowedCustomerEdit && (
                  <TableCell align="right">
                    <Tooltip title="Business controlled">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, color: 'text.disabled' }}>
                        <LockIcon sx={{ fontSize: 12 }} />
                        <Typography variant="body2">{formatCurrency(item.unitPrice)}</Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                )}
                {!allowedCustomerEdit && (
                  <TableCell align="right">
                    <Tooltip title="Business controlled">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, color: 'text.disabled' }}>
                        <LockIcon sx={{ fontSize: 12 }} />
                        <Typography variant="body2">{item.taxPercent}%</Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                )}
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
        <TextField
          label="Expiry Date"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
          size="small"
        />
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Grand Total</Typography>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {formatCurrency(totals.grandTotal)}
          </Typography>
        </Box>
      </Box>

      <TextField
        label="Notes / Remarks"
        multiline
        rows={3}
        fullWidth
        value={customerNotes}
        onChange={(e) => setCustomerNotes(e.target.value)}
        placeholder="Add any notes or remarks..."
        sx={{ mb: 2 }}
        size="small"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        label="Submission Remarks *"
        multiline
        rows={2}
        fullWidth
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Describe the changes you made (required)..."
        sx={{ mb: 2 }}
        size="small"
      />

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={saving || !remarks.trim()}
        >
          {saving ? 'Submitting...' : 'Send for Approval'}
        </Button>
      </Box>
    </Box>
  );
}
