'use client';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Skeleton,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

const ICON_MAP = {
  accepted: {
    icon: <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />,
    color: '#1F6B47',
    bg: 'rgba(31,107,71,0.08)',
  },
  sent: {
    icon: <SendRoundedIcon sx={{ fontSize: 16 }} />,
    color: '#5F6B62',
    bg: 'rgba(95,107,98,0.08)',
  },
  request: {
    icon: <NotificationsActiveRoundedIcon sx={{ fontSize: 16 }} />,
    color: '#F4B740',
    bg: 'rgba(244,183,64,0.08)',
  },
  payment: {
    icon: <PaymentRoundedIcon sx={{ fontSize: 16 }} />,
    color: '#1F6B47',
    bg: 'rgba(31,107,71,0.08)',
  },
  created: {
    icon: <DescriptionRoundedIcon sx={{ fontSize: 16 }} />,
    color: '#5F6B62',
    bg: 'rgba(95,107,98,0.08)',
  },
  updated: {
    icon: <EditRoundedIcon sx={{ fontSize: 16 }} />,
    color: '#A2A8A4',
    bg: 'rgba(162,168,164,0.08)',
  },
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ActivityRow({ activity }) {
  const iconConfig = ICON_MAP[activity.type] || ICON_MAP.created;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        py: 1.5,
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: iconConfig.bg,
          color: iconConfig.color,
          flexShrink: 0,
          '& svg': { fontSize: 16 },
        }}
      >
        {iconConfig.icon}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
            fontSize: '0.8125rem',
            lineHeight: 1.4,
          }}
        >
          {activity.title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.25,
          }}
        >
          <AccessTimeRoundedIcon sx={{ fontSize: 11, color: '#C8CCCA' }} />
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              color: 'text.disabled',
            }}
          >
            {timeAgo(activity.time)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function RecentActivity({ activities = [], loading = false }) {
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
        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'text.primary',
              letterSpacing: '-0.01em',
            }}
          >
            Recent Activity
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 0.25,
              fontSize: '0.8125rem',
            }}
          >
            Latest actions on your account
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" height={16} />
                  <Skeleton variant="text" width="30%" height={12} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : activities.length > 0 ? (
          <Box sx={{ flex: 1 }}>
            {activities.slice(0, 6).map((activity, idx) => (
              <Box
                key={idx}
                sx={{
                  borderBottom:
                    idx < Math.min(activities.length, 6) - 1
                      ? '1px solid'
                      : 'none',
                  borderColor: 'divider',
                }}
              >
                <ActivityRow activity={activity} />
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
              No recent activity
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
