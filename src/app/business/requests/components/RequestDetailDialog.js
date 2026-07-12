'use client';
import {
  Box, Typography, Chip, Button, Divider, List,
  ListItem, ListItemText, TextField
} from '@mui/material';
import AppDialog from '@/components/common/AppDialog';
import StatusChip from '@/components/common/StatusChip';
import { formatDate } from '@/utils/formatters';
import { REQUEST_STATUS } from '@/constants/statuses';
import { useState } from 'react';

export default function RequestDetailDialog({ open, onClose, request, onStatusUpdate }) {
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const actions = (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Button onClick={() => {
        if (rejecting) setRejecting(false);
        else onClose();
      }} color="inherit">
        {rejecting ? 'Cancel Rejection' : 'Close'}
      </Button>
      {!rejecting && request.status === REQUEST_STATUS.SUBMITTED && (
        <Button
          variant="outlined"
          color="warning"
          onClick={() => onStatusUpdate(REQUEST_STATUS.UNDER_REVIEW)}
        >
          Mark Under Review
        </Button>
      )}
      {!rejecting && request.status === REQUEST_STATUS.UNDER_REVIEW && (
        <>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setRejecting(true)}
          >
            Reject
          </Button>
          {/* Approve button removed as approval happens on quotation creation */}
        </>
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
      title={`Request: ${request.id}`}
      actions={actions}
      maxWidth="sm"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">CUSTOMER</Typography>
            <Typography variant="body1" fontWeight={600}>{request.customerInfo.name}</Typography>
            {request.customerInfo.company && <Typography variant="body2" color="text.secondary">{request.customerInfo.company}</Typography>}
            <Typography variant="body2" color="text.secondary">{request.customerInfo.email} • {request.customerInfo.phone}</Typography>
          </Box>
        )}

        <Divider />

        {/* Items Requested */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">ITEMS REQUESTED</Typography>
          <List disablePadding>
            {request.items.map((item, i) => (
              <ListItem key={i} disablePadding sx={{ py: 1 }}>
                <ListItemText
                  primary={<Typography variant="body2" fontWeight={600}>{item.name} × {item.quantity}</Typography>}
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
              <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">CUSTOMER NOTE</Typography>
              <Typography variant="body2">{request.generalNote}</Typography>
            </Box>
          </>
        )}

        {/* Rejection Form */}
        {rejecting && (
          <>
            <Divider sx={{ borderColor: 'error.main', opacity: 0.2 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1} color="error.main">REJECTION REASON (Sent to customer)</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Please provide a reason for rejecting this request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                variant="outlined"
                color="error"
                autoFocus
              />
            </Box>
          </>
        )}
      </Box>
    </AppDialog>
  );
}
