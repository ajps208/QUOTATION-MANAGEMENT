'use client';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: '#1E1E1E',
          borderRadius: 3,
          px: 2,
          py: 1.5,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.06)',
          minWidth: 110,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: '#A2A8A4', fontSize: '0.6875rem', display: 'block', mb: 0.5 }}
        >
          {label}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem' }}
        >
          {payload[0].value} quotation{payload[0].value !== 1 ? 's' : ''}
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function QuotationsChart({ data, loading = false }) {
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
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'text.primary',
              letterSpacing: '-0.01em',
            }}
          >
            Monthly Quotations
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 0.25,
              fontSize: '0.8125rem',
            }}
          >
            Quotations created per month
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minHeight: 260 }}>
          {loading ? (
            <Skeleton
              variant="rounded"
              height={260}
              sx={{ borderRadius: 3 }}
            />
          ) : data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
                barSize={28}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#68AE8E" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1F6B47" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ECECEC"
                  strokeOpacity={0.8}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#A2A8A4',
                    fontWeight: 500,
                  }}
                  dy={10}
                  tickMargin={4}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#A2A8A4',
                    fontWeight: 500,
                  }}
                  dx={-4}
                  allowDecimals={false}
                  width={36}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: 'rgba(31,107,71,0.04)',
                    radius: 6,
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
              }}
            >
              <Typography variant="body2" color="text.disabled">
                No quotation data available
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
