'use client';
import { Box, Typography, Button, Chip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import { useRouter } from 'next/navigation';

const quickActions = [
  {
    label: 'New Quotation',
    icon: <NoteAddRoundedIcon sx={{ fontSize: 18 }} />,
    path: '/business/quotations/new',
    color: '#1F6B47',
    bg: 'rgba(31,107,71,0.06)',
    hoverBg: 'rgba(31,107,71,0.10)',
  },
  {
    label: 'Add Product',
    icon: <Inventory2RoundedIcon sx={{ fontSize: 18 }} />,
    path: '/business/products',
    color: '#5F6B62',
    bg: 'rgba(95,107,98,0.06)',
    hoverBg: 'rgba(95,107,98,0.10)',
  },
  {
    label: 'Add Customer',
    icon: <PeopleAltRoundedIcon sx={{ fontSize: 18 }} />,
    path: '/business/customers',
    color: '#1F6B47',
    bg: 'rgba(31,107,71,0.06)',
    hoverBg: 'rgba(31,107,71,0.10)',
  },
];

export default function DashboardHeader({ userName, businessName }) {
  const router = useRouter();
  const firstName = userName?.split(' ')[0] || userName;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', lg: 'center' },
        gap: { xs: 3, lg: 2 },
        mb: { xs: 3, md: 4 },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75, flexWrap: 'wrap' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.375rem', sm: '1.625rem', md: '1.75rem' },
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'text.primary',
              lineHeight: 1.2,
            }}
          >
            {getGreeting()}, {firstName}
          </Typography>
          <Chip
            label="Business"
            size="small"
            sx={{
              height: 22,
              fontSize: '0.6875rem',
              fontWeight: 600,
              bgcolor: 'rgba(31,107,71,0.08)',
              color: '#1F6B47',
              borderRadius: 2.5,
              '& .MuiChip-label': { px: 1, lineHeight: 1.4 },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.8125rem', md: '0.875rem' },
            }}
          >
            {dateStr}
          </Typography>
          {businessName && (
            <>
              <Box
                sx={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  bgcolor: 'text.disabled',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.8125rem', md: '0.875rem' },
                  fontWeight: 500,
                }}
              >
                {businessName}
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        {quickActions.map((action) => (
          <Button
            key={action.label}
            startIcon={action.icon}
            onClick={() => router.push(action.path)}
            sx={{
              borderRadius: 3,
              px: 2,
              py: 1,
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: action.color,
              bgcolor: action.bg,
              border: 'none',
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': {
                bgcolor: action.hoverBg,
                boxShadow: 'none',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            {action.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
