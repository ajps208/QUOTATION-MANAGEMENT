import { Alert, Box } from '@mui/material';

export default function ErrorState({ message }) {
  return (
    <Box sx={{ py: 2 }}>
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        {message}
      </Alert>
    </Box>
  );
}
