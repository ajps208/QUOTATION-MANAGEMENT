'use client';

import { Snackbar, Alert } from '@mui/material';
import { useSnackbarStore } from '@/hooks/useSnackbar';

export default function GlobalSnackbar() {
  const { open, message, severity, closeSnackbar } = useSnackbarStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={closeSnackbar} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
