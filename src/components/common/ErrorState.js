import { Alert, Box } from '@mui/material';

export default function ErrorState({ message }) {
  return (
    <Box sx={{ py: 3 }}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}
