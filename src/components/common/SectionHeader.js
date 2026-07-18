import { Box, Typography } from '@mui/material';

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
      <Box>
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ letterSpacing: '-0.015em', fontSize: '1.125rem' }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
}
