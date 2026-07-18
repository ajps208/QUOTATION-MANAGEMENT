import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingState({ title = 'Loading...' }) {
  return (
    <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <CircularProgress size={32} sx={{ color: 'primary.main' }} />
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
        {title}
      </Typography>
    </Box>
  );
}
