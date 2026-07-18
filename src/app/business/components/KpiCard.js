'use client';
import { Box, Card, CardContent, Typography } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

const colorConfig = {
  primary: {
    bg: 'rgba(31,107,71,0.06)',
    iconBg: 'linear-gradient(135deg, rgba(31,107,71,0.12) 0%, rgba(104,174,142,0.06) 100%)',
    iconColor: '#1F6B47',
    accent: '#1F6B47',
  },
  secondary: {
    bg: 'rgba(95,107,98,0.06)',
    iconBg: 'linear-gradient(135deg, rgba(95,107,98,0.12) 0%, rgba(162,168,164,0.06) 100%)',
    iconColor: '#5F6B62',
    accent: '#5F6B62',
  },
  success: {
    bg: 'rgba(31,107,71,0.06)',
    iconBg: 'linear-gradient(135deg, rgba(31,107,71,0.12) 0%, rgba(104,174,142,0.06) 100%)',
    iconColor: '#1F6B47',
    accent: '#1F6B47',
  },
  warning: {
    bg: 'rgba(244,183,64,0.06)',
    iconBg: 'linear-gradient(135deg, rgba(244,183,64,0.12) 0%, rgba(250,213,114,0.06) 100%)',
    iconColor: '#F4B740',
    accent: '#F4B740',
  },
  error: {
    bg: 'rgba(229,115,115,0.06)',
    iconBg: 'linear-gradient(135deg, rgba(229,115,115,0.12) 0%, rgba(245,178,178,0.06) 100%)',
    iconColor: '#E57373',
    accent: '#E57373',
  },
  info: {
    bg: 'rgba(31,107,71,0.06)',
    iconBg: 'linear-gradient(135deg, rgba(31,107,71,0.12) 0%, rgba(104,174,142,0.06) 100%)',
    iconColor: '#1F6B47',
    accent: '#1F6B47',
  },
};

function TrendIndicator({ trend, trendLabel }) {
  if (trend === undefined || trend === null) return null;

  const isPositive = trend > 0;
  const isNegative = trend < 0;
  const isNeutral = trend === 0;

  const color = isPositive ? '#1F6B47' : isNegative ? '#E57373' : '#A2A8A4';
  const bg = isPositive ? 'rgba(31,107,71,0.08)' : isNegative ? 'rgba(229,115,115,0.08)' : 'rgba(162,168,164,0.08)';
  const Icon = isPositive ? TrendingUpRoundedIcon : isNegative ? TrendingDownRoundedIcon : RemoveRoundedIcon;
  const label = trendLabel || (isPositive ? 'up' : isNegative ? 'down' : 'flat');

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.35,
        px: 0.75,
        py: 0.25,
        borderRadius: 2,
        bgcolor: bg,
        color,
        lineHeight: 1,
      }}
    >
      <Icon sx={{ fontSize: 13 }} />
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          color: 'inherit',
          lineHeight: 1,
        }}
      >
        {isNeutral ? '0%' : `${Math.abs(trend)}%`}
      </Typography>
    </Box>
  );
}

export default function KpiCard({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend,
  trendLabel,
  loading = false,
}) {
  const config = colorConfig[color] || colorConfig.primary;

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${config.accent}, ${config.accent}66)`,
          opacity: 0,
          transition: 'opacity 0.2s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)',
          borderColor: `${config.accent}30`,
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: '16px !important', sm: '20px !important', md: '24px !important' },
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              background: config.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: config.iconColor,
              '& svg': { fontSize: 22 },
              transition: 'transform 0.2s ease',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {icon}
          </Box>
          <TrendIndicator trend={trend} trendLabel={trendLabel} />
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'text.primary',
            mb: 0.5,
          }}
        >
          {loading ? '—' : value}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: 'text.secondary',
            mb: subtitle ? 0.25 : 0,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              fontSize: '0.6875rem',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
