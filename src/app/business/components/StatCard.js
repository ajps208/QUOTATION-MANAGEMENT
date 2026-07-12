import { Box, Card, CardContent, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const colorMap = {
  primary: { bg: '#ede9fe', icon: '#4f46e5', accent: '#4f46e5' },
  secondary: { bg: '#e0f2fe', icon: '#0284c7', accent: '#0284c7' },
  success: { bg: '#dcfce7', icon: '#16a34a', accent: '#16a34a' },
  warning: { bg: '#fef9c3', icon: '#ca8a04', accent: '#ca8a04' },
  error: { bg: '#fee2e2', icon: '#dc2626', accent: '#dc2626' },
  info: { bg: '#dbeafe', icon: '#2563eb', accent: '#2563eb' },
};

export default function StatCard({ title, value, subtitle, icon, color = 'primary', trend }) {
  const colors = colorMap[color] || colorMap.primary;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 40px -8px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardContent sx={{ p: '28px !important' }}>
        {/* Top row: Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            bgcolor: colors.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.icon,
            mb: 3,
            '& svg': { fontSize: 24 },
          }}
        >
          {icon}
        </Box>

        {/* Value */}
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ letterSpacing: '-0.02em', lineHeight: 1, mb: 1 }}
        >
          {value}
        </Typography>

        {/* Title */}
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={500}
          sx={{ mb: subtitle ? 1.5 : 0 }}
        >
          {title}
        </Typography>

        {/* Subtitle / trend */}
        {subtitle && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
