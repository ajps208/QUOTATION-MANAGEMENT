import { Box, Typography } from '@mui/material';

export default function EmptyState({ title, description }) {
  return (
    <Box sx={{ py: 6, px: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 3 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {description}
      </Typography>
    </Box>
  );
}
