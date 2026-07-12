'use client';
import {
  Box, Typography, Chip, Button, Divider, List,
  ListItem, ListItemText
} from '@mui/material';
import AppDialog from '@/components/common/AppDialog';
import StatusChip from '@/components/common/StatusChip';
import { formatDate } from '@/utils/formatters';
import { REQUEST_STATUS } from '@/constants/statuses';

export default function RequestDetailDialog({ open, onClose, request, customer, onStatusUpdate }) {
  const actions = (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Button onClick={onClose} color="inherit">Close</Button>
      {request.status === REQUEST_STATUS.SUBMITTED && (
        <Button
          variant="outlined"
          color="warning"
          onClick={() => onStatusUpdate(REQUEST_STATUS.UNDER_REVIEW)}
        >
          Mark Under Review
        </Button>
      )}
      {request.status === REQUEST_STATUS.UNDER_REVIEW && (
        <>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onStatusUpdate(REQUEST_STATUS.REJECTED)}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => onStatusUpdate(REQUEST_STATUS.APPROVED)}
          >
            Approve
          </Button>
        </>
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
        {customer && (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">CUSTOMER</Typography>
            <Typography variant="body1" fontWeight={600}>{customer.name}</Typography>
            <Typography variant="body2" color="text.secondary">{customer.companyName}</Typography>
            <Typography variant="body2" color="text.secondary">{customer.email} • {customer.phone}</Typography>
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
      </Box>
    </AppDialog>
  );
}
