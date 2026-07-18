import { Box, Typography } from '@mui/material';
import AppButton from './AppButton';

export default function PageHeader({ title, subtitle, actionLabel, onAction, actionIcon }) {
  return (
    <Box sx={{ mb: { xs: 3, md: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              letterSpacing: '-0.025em',
              color: 'text.primary',
              lineHeight: 1.3,
              fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2.25rem' },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 0.75, lineHeight: 1.6, maxWidth: 560 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {actionLabel && (
          <AppButton
            variant="contained"
            startIcon={actionIcon}
            onClick={onAction}
            sx={{ flexShrink: 0, mt: 0.25 }}
          >
            {actionLabel}
          </AppButton>
        )}
      </Box>
    </Box>
  );
}
