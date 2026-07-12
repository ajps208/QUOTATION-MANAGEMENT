import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingState({ title = 'Loading data...' }) {
  return (
    <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <CircularProgress />
      <Typography color="text.secondary">{title}</Typography>
    </Box>
  );
}
