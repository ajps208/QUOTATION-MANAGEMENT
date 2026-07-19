'use client';
import { useState } from 'react';
import {
  Box, Typography, Chip, Button, Divider, List,
  ListItem, ListItemText
} from '@mui/material';
import AppDialog from '@/components/common/AppDialog';
import FormField from '@/components/common/FormField';
import StatusChip from '@/components/common/StatusChip';
import { formatDate } from '@/utils/formatters';
import { REQUEST_STATUS } from '@/constants/statuses';

export default function RequestDetailDialog({ open, onClose, request, onStatusUpdate }) {
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const actions = (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
      <Button
        onClick={() => {
          if (rejecting) setRejecting(false);
          else onClose();
        }}
        color="inherit"
        sx={{ borderRadius: 1 }}
      >
        {rejecting ? 'Cancel' : 'Close'}
      </Button>
      {!rejecting && request.status === REQUEST_STATUS.SUBMITTED && (
        <Button
          variant="outlined"
          color="warning"
          onClick={() => onStatusUpdate(REQUEST_STATUS.UNDER_REVIEW)}
          sx={{ borderRadius: 1 }}
        >
          Mark Under Review
        </Button>
      )}
      {!rejecting && request.status === REQUEST_STATUS.UNDER_REVIEW && (
        <Button
          variant="outlined"
          color="error"
          onClick={() => setRejecting(true)}
          sx={{ borderRadius: 1 }}
        >
          Reject
        </Button>
      )}
      {rejecting && (
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            if (rejectionReason.trim()) {
              onStatusUpdate(REQUEST_STATUS.REJECTED, rejectionReason);
            }
          }}
          disabled={!rejectionReason.trim()}
          sx={{ borderRadius: 1, minWidth: 140 }}
        >
          Confirm Rejection
        </Button>
      )}
    </Box>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={`Request from ${request.customerInfo?.name || 'Unknown Customer'}`}
      actions={actions}
      maxWidth="sm"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Status & Dates */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <StatusChip status={request.status} />
          <Typography variant="caption" color="text.secondary">
            Received: {formatDate(request.requestDate)}
          </Typography>
        </Box>

        <Divider />

        {/* Customer Info */}
        {request.customerInfo && (
          <Box>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem' }}>
              Customer
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ mt: 0.75 }}>
              {request.customerInfo.name}
            </Typography>
            {request.customerInfo.company && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {request.customerInfo.company}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {request.customerInfo.email} · {request.customerInfo.phone}
            </Typography>
          </Box>
        )}

        <Divider />

        {/* Items Requested */}
        <Box>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem' }}>
            Items Requested
          </Typography>
          <List disablePadding sx={{ mt: 1 }}>
            {request.items.map((item, i) => (
              <ListItem key={i} disablePadding sx={{ py: 1 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={600}>
                      {item.name} × {item.quantity}
                    </Typography>
                  }
                  secondary={item.notes ? `Notes: ${item.notes}` : null}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* General Note */}
        {request.generalNote && (
          <>
            <Divider />
            <Box>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem' }}>
                Customer Note
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.75, lineHeight: 1.6 }}>
                {request.generalNote}
              </Typography>
            </Box>
          </>
        )}

        {/* Rejection Form */}
        {rejecting && (
          <>
            <Divider sx={{ borderColor: 'error.main', opacity: 0.3 }} />
            <Box>
              <Typography variant="caption" fontWeight={600} color="error.main" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem' }}>
                Rejection Reason (sent to customer)
              </Typography>
              <FormField
                fullWidth
                multiline
                rows={3}
                placeholder="Please provide a reason for rejecting this request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                autoFocus
                sx={{ mt: 1.5 }}
              />
            </Box>
          </>
        )}
      </Box>
    </AppDialog>
  );
}
