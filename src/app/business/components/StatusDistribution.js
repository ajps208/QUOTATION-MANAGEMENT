'use client';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const STATUS_COLORS = {
  Draft: '#A2A8A4',
  Sent: '#5F6B62',
  Viewed: '#5F6B62',
  Accepted: '#1F6B47',
  Rejected: '#E57373',
  Expired: '#F4B740',
  Cancelled: '#A2A8A4',
  'Changes Requested': '#F4B740',
  Revised: '#1F6B47',
};

const DEFAULT_COLORS = ['#1F6B47', '#5F6B62', '#68AE8E', '#F4B740', '#E57373', '#A2A8A4', '#16553A', '#07240D'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <Box
        sx={{
          bgcolor: '#1E1E1E',
          borderRadius: 3,
          px: 2,
          py: 1.5,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.06)',
          minWidth: 120,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: data.payload.fill || data.color,
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: '#C8CCCA', fontSize: '0.75rem' }}
          >
            {data.name}
          </Typography>
        </Box>
        <Typography
          variant="subtitle2"
          sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem' }}
        >
          {data.value} quotation{data.value !== 1 ? 's' : ''}
        </Typography>
      </Box>
    );
  }
  return null;
};

function LegendItem({ name, value, color, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 0.75,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: 2,
            bgcolor: color,
            flexShrink: 0,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.8125rem',
            color: 'text.secondary',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.6875rem',
            color: 'text.disabled',
            minWidth: 32,
            textAlign: 'right',
          }}
        >
          {pct}%
        </Typography>
      </Box>
    </Box>
  );
}

export default function StatusDistribution({ data, loading = false }) {
  const total = data?.reduce((sum, d) => sum + d.value, 0) || 0;

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
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'text.primary',
              letterSpacing: '-0.01em',
            }}
          >
            Quotation Status
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 0.25,
              fontSize: '0.8125rem',
            }}
          >
            Distribution by current status
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rounded" height={28} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        ) : data && data.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 3,
              flex: 1,
            }}
          >
            <Box
              sx={{
                width: { xs: 180, sm: 160 },
                height: { xs: 180, sm: 160 },
                flexShrink: 0,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="58%"
                    outerRadius="85%"
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          STATUS_COLORS[entry.name] ||
                          DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
              {data.map((entry, index) => (
                <LegendItem
                  key={entry.name}
                  name={entry.name}
                  value={entry.value}
                  color={
                    STATUS_COLORS[entry.name] ||
                    DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                  }
                  total={total}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 160,
            }}
          >
            <Typography variant="body2" color="text.disabled">
              No status data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
