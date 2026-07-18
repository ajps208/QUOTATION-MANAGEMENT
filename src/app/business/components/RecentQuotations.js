'use client';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Skeleton,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import { QUOTATION_STATUS } from '@/constants/statuses';

const STATUS_STYLES = {
  [QUOTATION_STATUS.DRAFT]: { color: '#A2A8A4', bg: 'rgba(162,168,164,0.08)' },
  [QUOTATION_STATUS.SENT]: { color: '#5F6B62', bg: 'rgba(95,107,98,0.08)' },
  [QUOTATION_STATUS.VIEWED]: { color: '#5F6B62', bg: 'rgba(95,107,98,0.08)' },
  [QUOTATION_STATUS.ACCEPTED]: { color: '#1F6B47', bg: 'rgba(31,107,71,0.08)' },
  [QUOTATION_STATUS.REJECTED]: { color: '#E57373', bg: 'rgba(229,115,115,0.08)' },
  [QUOTATION_STATUS.EXPIRED]: { color: '#F4B740', bg: 'rgba(244,183,64,0.08)' },
  [QUOTATION_STATUS.CANCELLED]: { color: '#A2A8A4', bg: 'rgba(162,168,164,0.08)' },
  [QUOTATION_STATUS.CHANGES_REQUESTED]: { color: '#F4B740', bg: 'rgba(244,183,64,0.08)' },
  [QUOTATION_STATUS.REVISED]: { color: '#1F6B47', bg: 'rgba(31,107,71,0.08)' },
};

function QuotationRow({ quotation }) {
  const statusStyle = STATUS_STYLES[quotation.status] || STATUS_STYLES[QUOTATION_STATUS.DRAFT];
  const date = quotation.createdAt
    ? new Date(quotation.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2.5,
            bgcolor: statusStyle.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <FiberManualRecordRoundedIcon
            sx={{ fontSize: 10, color: statusStyle.color }}
          />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '0.8125rem',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {quotation.quotationNumber || 'Untitled'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              fontSize: '0.6875rem',
            }}
          >
            {quotation.customerName || 'Unknown customer'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        <Box
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: 2,
            bgcolor: statusStyle.bg,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: statusStyle.color,
              lineHeight: 1.4,
            }}
          >
            {quotation.status}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            fontSize: '0.6875rem',
            minWidth: 44,
            textAlign: 'right',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {date}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '0.8125rem',
            minWidth: 72,
            textAlign: 'right',
          }}
        >
          ₹{(quotation.grandTotal || 0).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}

export default function RecentQuotations({ quotations = [], loading = false }) {
  const router = useRouter();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          p: { xs: '16px !important', sm: '20px !important', md: '24px !important' },
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'text.primary',
              letterSpacing: '-0.01em',
            }}
          >
            Recent Quotations
          </Typography>
          <Button
            size="small"
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={() => router.push('/business/quotations')}
            sx={{
              px: 0,
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'primary.main',
              '&:hover': { bgcolor: 'transparent' },
            }}
          >
            View all
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: 2.5 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={18} />
                  <Skeleton variant="text" width="40%" height={14} />
                </Box>
                <Skeleton variant="text" width={60} height={18} />
              </Box>
            ))}
          </Box>
        ) : quotations.length > 0 ? (
          <Box sx={{ flex: 1 }}>
            {quotations.slice(0, 5).map((q, idx) => (
              <Box
                key={q._id || idx}
                sx={{
                  borderBottom:
                    idx < Math.min(quotations.length, 5) - 1
                      ? '1px solid'
                      : 'none',
                  borderColor: 'divider',
                }}
              >
                <QuotationRow quotation={q} />
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120,
            }}
          >
            <Typography variant="body2" color="text.disabled">
              No quotations yet
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
