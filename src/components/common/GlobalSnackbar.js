'use client';

import { Snackbar, Alert, IconButton, Stack, LinearProgress, Box } from '@mui/material';
import { useSnackbarStore } from '@/hooks/useSnackbar';
import { Close, CheckCircle, Error, Warning, Info, Refresh } from '@mui/icons-material';

const severityIcons = {
  success: <CheckCircle fontSize="small" sx={{ mr: 1 }} />,
  error: <Error fontSize="small" sx={{ mr: 1 }} />,
  warning: <Warning fontSize="small" sx={{ mr: 1 }} />,
  info: <Info fontSize="small" sx={{ mr: 1 }} />,
};

export default function GlobalSnackbar() {
  const { open, message, severity, closeSnackbar, action, actionLabel, progress, id } = useSnackbarStore();

  if (!open) return null;

  return (
    <Snackbar
      key={id}
      open={open}
      autoHideDuration={progress ? 0 : severity === 'error' ? 8000 : 5000}
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
        action={
          <Stack direction="row" spacing={1} sx={{ ml: 'auto', flexShrink: 0 }}>
            {action && actionLabel && (
              <Button
                size="small"
                variant={severity === 'error' ? 'outlined' : 'text'}
                color="inherit"
                onClick={() => {
                  action();
                  closeSnackbar();
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                }}
              >
                {actionLabel}
              </Button>
            )}
            <IconButton
              size="small"
              onClick={closeSnackbar}
              sx={{
                color: 'inherit',
                opacity: 0.7,
                '&:hover': { opacity: 1, bgcolor: 'transparent' },
                px: 0.5,
              }}
              aria-label="dismiss"
            >
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        }
        sx={{
          width: '100%',
          minWidth: 300,
          maxWidth: 450,
          borderRadius: 3,
          fontWeight: 500,
          fontSize: '0.875rem',
          boxShadow: '0 8px 32px -4px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          p: 2,
          '& .MuiAlert-message': { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 },
          '& .MuiAlert-icon': { flexShrink: 0, mt: 0.125 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {severityIcons[severity] || severityIcons.info}
          <Typography variant="body2" sx={{ flex: 1, lineHeight: 1.6, color: 'inherit' }}>
            {message}
          </Typography>
        </Box>
        
        {progress && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress
              variant={progress < 100 ? 'determinate' : 'indeterminate'}
              value={progress < 100 ? progress : 0}
              sx={{
                height: 4,
                borderRadius: 2,
                '& .MuiLinearProgress-bar': { borderRadius: 2 },
              }}
            />
            <Typography variant="caption" sx={{ mt: 0.5, textAlign: 'right', opacity: 0.8 }}>
              {progress < 100 ? `${Math.round(progress)}%` : 'Processing...'}
            </Typography>
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
}

export function SnackbarProvider({ children }) {
  return (
    <>
      {children}
      <GlobalSnackbar />
    </>
  );
}