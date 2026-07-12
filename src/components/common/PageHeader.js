import { Box, Button, Divider, Typography } from '@mui/material';

export default function PageHeader({ title, subtitle, actionLabel, onAction, actionIcon }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 3,
          flexWrap: 'wrap',
          mb: subtitle ? 0 : 0,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{ letterSpacing: '-0.01em', color: 'text.primary', lineHeight: 1.2 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1, lineHeight: 1.6, maxWidth: 600 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {actionLabel && (
          <Button
            variant="contained"
            startIcon={actionIcon}
            onClick={onAction}
            sx={{ flexShrink: 0, mt: 0.5 }}
          >
            {actionLabel}
          </Button>
        )}
      </Box>
      <Divider sx={{ mt: 4 }} />
    </Box>
  );
}
