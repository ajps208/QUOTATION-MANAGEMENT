'use client';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

const actions = [
  {
    label: 'Create Quotation',
    description: 'Build and send a new quotation',
    icon: <NoteAddRoundedIcon sx={{ fontSize: 22 }} />,
    path: '/business/quotations/new',
    color: '#1F6B47',
    bg: 'linear-gradient(135deg, rgba(31,107,71,0.08) 0%, rgba(104,174,142,0.04) 100%)',
    hoverBg: 'linear-gradient(135deg, rgba(31,107,71,0.14) 0%, rgba(104,174,142,0.08) 100%)',
  },
  {
    label: 'Manage Products',
    description: 'Add or update your product catalog',
    icon: <Inventory2RoundedIcon sx={{ fontSize: 22 }} />,
    path: '/business/products',
    color: '#5F6B62',
    bg: 'linear-gradient(135deg, rgba(95,107,98,0.08) 0%, rgba(162,168,164,0.04) 100%)',
    hoverBg: 'linear-gradient(135deg, rgba(95,107,98,0.14) 0%, rgba(162,168,164,0.08) 100%)',
  },
  {
    label: 'Manage Customers',
    description: 'View and organize your customers',
    icon: <PeopleAltRoundedIcon sx={{ fontSize: 22 }} />,
    path: '/business/customers',
    color: '#1F6B47',
    bg: 'linear-gradient(135deg, rgba(31,107,71,0.08) 0%, rgba(104,174,142,0.04) 100%)',
    hoverBg: 'linear-gradient(135deg, rgba(31,107,71,0.14) 0%, rgba(104,174,142,0.08) 100%)',
  },
  {
    label: 'Templates',
    description: 'Manage quotation templates',
    icon: <ContentPasteRoundedIcon sx={{ fontSize: 22 }} />,
    path: '/business/templates',
    color: '#5F6B62',
    bg: 'linear-gradient(135deg, rgba(95,107,98,0.08) 0%, rgba(162,168,164,0.04) 100%)',
    hoverBg: 'linear-gradient(135deg, rgba(95,107,98,0.14) 0%, rgba(162,168,164,0.08) 100%)',
  },
  {
    label: 'Categories',
    description: 'Organize products by category',
    icon: <CategoryRoundedIcon sx={{ fontSize: 22 }} />,
    path: '/business/categories',
    color: '#F4B740',
    bg: 'linear-gradient(135deg, rgba(244,183,64,0.08) 0%, rgba(250,213,114,0.04) 100%)',
    hoverBg: 'linear-gradient(135deg, rgba(244,183,64,0.14) 0%, rgba(250,213,114,0.08) 100%)',
  },
  {
    label: 'Settings',
    description: 'Configure your business profile',
    icon: <SettingsRoundedIcon sx={{ fontSize: 22 }} />,
    path: '/business/settings',
    color: '#A2A8A4',
    bg: 'linear-gradient(135deg, rgba(162,168,164,0.08) 0%, rgba(200,204,202,0.04) 100%)',
    hoverBg: 'linear-gradient(135deg, rgba(162,168,164,0.14) 0%, rgba(200,204,202,0.08) 100%)',
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: 'text.primary',
          letterSpacing: '-0.01em',
          mb: 2,
        }}
      >
        Quick Actions
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        {actions.map((action) => (
          <Card
            key={action.label}
            onClick={() => router.push(action.path)}
            sx={{
              cursor: 'pointer',
              bgcolor: 'transparent',
              border: '1px solid',
              borderColor: 'divider',
              backgroundImage: 'none',
              '&:hover': {
                bgcolor: action.hoverBg,
                borderColor: `${action.color}30`,
                boxShadow: `0 4px 16px ${action.color}10`,
                '& .action-icon': {
                  transform: 'scale(1.08)',
                },
              },
            }}
          >
            <CardContent
              sx={{
                p: { xs: '14px !important', sm: '16px !important' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', sm: 'flex-start' },
                textAlign: { xs: 'center', sm: 'left' },
                gap: 1.5,
              }}
            >
              <Box
                className="action-icon"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 3,
                  background: action.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: action.color,
                  transition: 'transform 0.2s ease',
                  flexShrink: 0,
                }}
              >
                {action.icon}
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '0.8125rem',
                    mb: 0.25,
                    lineHeight: 1.3,
                  }}
                >
                  {action.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.disabled',
                    fontSize: '0.6875rem',
                    lineHeight: 1.4,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {action.description}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
