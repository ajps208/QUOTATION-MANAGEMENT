'use client';

import { Snackbar, Alert } from '@mui/material';
import { useSnackbarStore } from '@/hooks/useSnackbar';

export default function GlobalSnackbar() {
  const { open, message, severity, closeSnackbar } = useSnackbarStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbar-root': { bottom: { xs: 16, sm: 24 } },
      }}
    >
      <Alert
        onClose={closeSnackbar}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          minWidth: 280,
          borderRadius: 3,
          fontWeight: 500,
          fontSize: '0.875rem',
          boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
