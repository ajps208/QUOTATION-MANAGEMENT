'use client';

import {
  Box, Card, CardContent, Typography, Stack, Chip, IconButton, Tooltip,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StatusChip from '@/components/common/StatusChip';
import { formatDate } from '@/utils/formatters';

export default function RequestCard({ request, businessName, onView, onDelete, index = 0 }) {
  const subject = request.items?.[0]?.name || 'Quotation Request';
  const extraItems = (request.items?.length || 0) - 1;

  return (
    <Card
      className="card-hover"
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        animation: `fadeIn 0.3s ease ${index * 0.04}s both`,
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: 'monospace', fontWeight: 500, letterSpacing: '0.02em' }}
            >
              #{request.id?.slice(-8).toUpperCase()}
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                mt: 0.25,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subject}
            </Typography>
          </Box>
          <StatusChip status={request.status} />
        </Box>

        <Typography variant="body2" color="text.secondary" noWrap>
          {businessName || 'Unknown Vendor'}
        </Typography>

        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {request.items?.slice(0, 3).map((item, i) => (
            <Chip
              key={i}
              label={`${item.name} × ${item.quantity}`}
              size="small"
              variant="outlined"
              sx={{
                height: 24,
                fontSize: '0.7rem',
                fontWeight: 500,
                borderColor: 'divider',
                '& .MuiChip-label': { px: 1 },
              }}
            />
          ))}
          {extraItems > 0 && (
            <Chip
              label={`+${extraItems} more`}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.7rem',
                fontWeight: 600,
                bgcolor: 'grey.100',
                color: 'text.secondary',
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}
        </Stack>

        {request.generalNote && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}
          >
            &ldquo;{request.generalNote}&rdquo;
          </Typography>
        )}

        {request.status === 'Rejected' && request.rejectionReason && (
          <Box sx={{ p: 1.5, bgcolor: 'error.50', borderRadius: 1.5, border: '1px solid', borderColor: 'error.200' }}>
            <Typography variant="caption" color="error.700" fontWeight={600} display="block" sx={{ mb: 0.25 }}>
              Rejection Reason
            </Typography>
            <Typography variant="caption" color="error.600">
              {request.rejectionReason}
            </Typography>
          </Box>
        )}

        <Box sx={{ flex: 1 }} />

        <Divider sx={{ my: 0.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ReceiptLongIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(request.createdAt || request.requestDate)}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onView?.(request); }}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main', bgcolor: 'primary.50' },
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {(request.status === 'Draft' || request.status === 'Changes Requested') && (
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); onDelete?.(request); }}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main', bgcolor: 'error.50' },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
