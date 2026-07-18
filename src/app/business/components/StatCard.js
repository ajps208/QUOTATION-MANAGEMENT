import { Box, Card, CardContent, Typography } from '@mui/material';

const colorMap = {
  primary: { bg: 'rgba(31,107,71,0.08)', icon: '#1F6B47' },
  secondary: { bg: 'rgba(95,107,98,0.08)', icon: '#5F6B62' },
  success: { bg: 'rgba(31,107,71,0.08)', icon: '#1F6B47' },
  warning: { bg: 'rgba(244,183,64,0.08)', icon: '#F4B740' },
  error: { bg: 'rgba(229,115,115,0.08)', icon: '#E57373' },
  info: { bg: 'rgba(31,107,71,0.08)', icon: '#1F6B47' },
};

export default function StatCard({ title, value, subtitle, icon, color = 'primary' }) {
  const colors = colorMap[color] || colorMap.primary;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: '16px !important', sm: '20px !important' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 3,
              bgcolor: colors.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.icon,
              '& svg': { fontSize: 20 },
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ letterSpacing: '-0.025em', lineHeight: 1, mb: 0.5, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}
        >
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: subtitle ? 0.5 : 0 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6875rem' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
