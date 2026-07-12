'use client';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid #f1f5f9',
          borderRadius: 2,
          px: 2.5,
          py: 1.5,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
        <Typography variant="subtitle2" fontWeight={700} color="primary.main">
          ₹{payload[0].value.toLocaleString()}
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function RevenueChart({ data }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '28px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Revenue Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Monthly revenue from accepted quotations
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minHeight: 280 }}>
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                  dy={12}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                  dx={-8}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#4f46e5', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">No revenue data available.</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
