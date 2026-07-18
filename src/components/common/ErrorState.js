'use client';

import { useState, useCallback, useEffect } from 'react';
import { Alert, Box, Button, IconButton, Typography, Stack, Collapse, Paper } from '@mui/material';
import { Refresh, Error, Info, Warning, Close, ExpandMore, ExpandLess, CloudOff, Lock, SearchOff, ReportProblem, SupportAgent } from '@mui/icons-material';

const errorTypes = {
  network: {
    icon: <CloudOff sx={{ fontSize: 48, color: '#E57373', opacity: 0.7 }} />,
    title: 'Connection Lost',
    description: 'Unable to connect to the server. Please check your internet connection and try again.',
    severity: 'error',
    recoverable: true,
  },
  server: {
    icon: <ReportProblem sx={{ fontSize: 48, color: '#E57373', opacity: 0.7 }} />,
    title: 'Server Error',
    description: 'Something went wrong on our end. Our team has been notified. Please try again in a moment.',
    severity: 'error',
    recoverable: true,
  },
  validation: {
    icon: <Warning sx={{ fontSize: 48, color: '#F4B740', opacity: 0.7 }} />,
    title: 'Validation Error',
    description: 'Please check the highlighted fields and correct any errors before submitting.',
    severity: 'warning',
    recoverable: true,
  },
  unauthorized: {
    icon: <Lock sx={{ fontSize: 48, color: '#E57373', opacity: 0.7 }} />,
    title: 'Access Denied',
    description: "You don't have permission to access this resource. Please log in or contact your administrator.",
    severity: 'error',
    recoverable: false,
  },
  notFound: {
    icon: <SearchOff sx={{ fontSize: 48, color: '#A2A8A4', opacity: 0.7 }} />,
    title: 'Not Found',
    description: 'The requested resource could not be found. It may have been moved or deleted.',
    severity: 'info',
    recoverable: false,
  },
  forbidden: {
    icon: <Lock sx={{ fontSize: 48, color: '#E57373', opacity: 0.7 }} />,
    title: 'Access Forbidden',
    description: "You don't have the necessary permissions to perform this action.",
    severity: 'error',
    recoverable: false,
  },
  timeout: {
    icon: <ReportProblem sx={{ fontSize: 48, color: '#F4B740', opacity: 0.7 }} />,
    title: 'Request Timeout',
    description: 'The request took too long to complete. Please try again.',
    severity: 'warning',
    recoverable: true,
  },
  unknown: {
    icon: <Error sx={{ fontSize: 48, color: '#E57373', opacity: 0.7 }} />,
    title: 'Unexpected Error',
    description: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    severity: 'error',
    recoverable: true,
  },
  quotaExceeded: {
    icon: <Warning sx={{ fontSize: 48, color: '#F4B740', opacity: 0.7 }} />,
    title: 'Limit Exceeded',
    description: "You've reached the maximum limit for this action. Please upgrade your plan or contact support.",
    severity: 'warning',
    recoverable: false,
  },
  maintenance: {
    icon: <SupportAgent sx={{ fontSize: 48, color: '#1F6B47', opacity: 0.7 }} />,
    title: 'Under Maintenance',
    description: "We're currently performing scheduled maintenance. Please try again later.",
    severity: 'info',
    recoverable: false,
  },
};

const errorMessages = {
  'Failed to fetch': 'network',
  'Network request failed': 'network',
  'Network Error': 'network',
  'timeout': 'timeout',
  'timed out': 'timeout',
  '401': 'unauthorized',
  'Unauthorized': 'unauthorized',
  '403': 'forbidden',
  'Forbidden': 'forbidden',
  '404': 'notFound',
  'Not Found': 'notFound',
  '500': 'server',
  '502': 'server',
  '503': 'server',
  '504': 'server',
  'Internal Server Error': 'server',
  'Bad Gateway': 'server',
  'Service Unavailable': 'server',
  'Gateway Timeout': 'server',
  'validation': 'validation',
  'Validation': 'validation',
  'Invalid': 'validation',
  'Required': 'validation',
  'quota': 'quotaExceeded',
  'limit': 'quotaExceeded',
  'maintenance': 'maintenance',
};

function getErrorType(error) {
  if (!error) return 'unknown';

  const message = error.message || error.toString();
  const status = error.status || error.response?.status;

  if (status) {
    const statusStr = status.toString();
    if (errorMessages[statusStr]) return errorMessages[statusStr];
  }

  for (const [key, type] of Object.entries(errorMessages)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return type;
    }
  }

  return 'unknown';
}

export function ErrorState({
  error,
  type,
  title,
  description,
  onRetry,
  retryLabel = 'Try Again',
  onDismiss,
  dismissLabel = 'Dismiss',
  showDetails = false,
  details,
  variant = 'default',
  size = 'md',
  showIcon = true,
  fullWidth = false,
  actionButtons,
}) {
  const [expanded, setExpanded] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const errorType = type || (error ? getErrorType(error) : 'unknown');
  const config = errorTypes[errorType] || errorTypes.unknown;

  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displaySeverity = config.severity;
  const isRecoverable = onRetry && config.recoverable;

  const handleRetry = useCallback(async () => {
    if (!onRetry) return;
    setRetrying(true);
    try {
      await onRetry();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setRetrying(false);
    }
  }, [onRetry]);

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  const sizeStyles = {
    sm: { iconSize: 32, titleSize: '0.9375rem', descSize: '0.8125rem', padding: 1.5, gap: 1 },
    md: { iconSize: 48, titleSize: '1.125rem', descSize: '0.875rem', padding: 2, gap: 1.5 },
    lg: { iconSize: 64, titleSize: '1.25rem', descSize: '1rem', padding: 3, gap: 2 },
    xl: { iconSize: 80, titleSize: '1.5rem', descSize: '1.125rem', padding: 4, gap: 2.5 },
  };

  const variantStyles = {
    default: {
      container: {
        borderRadius: 3,
        p: sizeStyles[size].padding,
        gap: sizeStyles[size].gap,
        ...(fullWidth ? { width: '100%' } : { maxWidth: 500, mx: 'auto' }),
      },
      title: { fontWeight: 600, color: 'text.primary' },
      description: { color: 'text.secondary', textAlign: 'center', maxWidth: 400 },
    },
    alert: {
      container: {
        borderRadius: 2,
        p: 2,
        gap: 1.5,
        ...(fullWidth ? { width: '100%' } : { maxWidth: '100%' }),
      },
      title: { fontWeight: 600, color: 'inherit' },
      description: { color: 'inherit', opacity: 0.9 },
    },
    inline: {
      container: {
        borderRadius: 2,
        p: 1.5,
        gap: 1,
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
      },
      title: { fontWeight: 600, color: 'text.primary', flex: 1 },
      description: { color: 'text.secondary', flex: 1 },
    },
    toast: {
      container: {
        borderRadius: 2,
        p: 1.5,
        gap: 1,
        minWidth: 280,
        maxWidth: 400,
      },
      title: { fontWeight: 600, color: 'inherit', fontSize: sizeStyles[size].titleSize },
      description: { color: 'inherit', opacity: 0.9, fontSize: sizeStyles[size].descSize },
    },
    page: {
      container: {
        minHeight: { xs: '50vh', md: '60vh' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, md: 4 },
        gap: sizeStyles[size].gap,
        textAlign: 'center',
      },
      title: { fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' },
      description: { color: 'text.secondary', maxWidth: 500, lineHeight: 1.7 },
    },
    card: {
      container: {
        borderRadius: 3,
        p: sizeStyles[size].padding,
        gap: sizeStyles[size].gap,
        width: '100%',
      },
      title: { fontWeight: 600, color: 'text.primary' },
      description: { color: 'text.secondary', textAlign: 'center', maxWidth: 400 },
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  if (variant === 'alert') {
    return (
      <Alert
        severity={displaySeverity}
        sx={{
          borderRadius: 2,
          fontWeight: 500,
          fontSize: '0.875rem',
          '& .MuiAlert-icon': { color: 'inherit' },
        }}
        onClose={handleDismiss}
        action={
          isRecoverable && (
            <Button
              size="small"
              onClick={handleRetry}
              disabled={retrying}
              sx={{ fontWeight: 600, textTransform: 'none', ml: 1 }}
            >
              {retrying ? 'Retrying...' : retryLabel}
            </Button>
          )
        }
      >
        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ width: '100%' }}>
          {showIcon && <Box sx={{ flexShrink: 0, mt: 0.25 }}>{config.icon}</Box>}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={styles.title}>{displayTitle}</Typography>
            <Typography variant="body2" sx={styles.description}>{displayDescription}</Typography>
          </Box>
        </Stack>
      </Alert>
    );
  }

  if (variant === 'inline') {
    return (
      <Box sx={styles.container} bgcolor={displaySeverity === 'error' ? 'error.light' : displaySeverity === 'warning' ? 'warning.light' : 'info.light'} sx={{ opacity: 0.1, border: '1px solid', borderColor: displaySeverity === 'error' ? 'error.main' : displaySeverity === 'warning' ? 'warning.main' : 'info.main' }}>
        {showIcon && <Box sx={{ flexShrink: 0, mt: 0.25, mr: 1 }}>{config.icon}</Box>}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={styles.title}>{displayTitle}</Typography>
          <Typography variant="body2" sx={styles.description}>{displayDescription}</Typography>
        </Box>
        {isRecoverable && (
          <Button
            size="small"
            onClick={handleRetry}
            disabled={retrying}
            sx={{ flexShrink: 0, fontWeight: 600, textTransform: 'none' }}
          >
            {retrying ? 'Retrying...' : retryLabel}
          </Button>
        )}
        {onDismiss && (
          <IconButton size="small" onClick={handleDismiss} sx={{ flexShrink: 0, ml: 1 }}>
            <Close fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  }

  return (
    <Paper
      elevation={variant === 'page' ? 0 : 1}
      variant={variant === 'page' ? 'outlined' : 'elevation'}
      sx={{
        ...styles.container,
        bgcolor: variant === 'page' ? 'background.default' : undefined,
        borderColor: variant === 'page' ? 'divider' : undefined,
      }}
    >
      <Stack direction="column" spacing={0} alignItems="center" sx={{ width: '100%' }}>
        {showIcon && config.icon && (
          <Box sx={{ mb: sizeStyles[size].gap / 2, display: 'flex', justifyContent: 'center' }}>
            {config.icon}
          </Box>
        )}

        <Typography
          variant="h6"
          sx={{
            ...styles.title,
            fontSize: sizeStyles[size].titleSize,
            textAlign: variant === 'page' || variant === 'default' ? 'center' : 'left',
            width: '100%',
          }}
        >
          {displayTitle}
        </Typography>

        {displayDescription && (
          <Typography
            variant="body1"
            sx={{
              ...styles.description,
              fontSize: sizeStyles[size].descSize,
              textAlign: variant === 'page' || variant === 'default' ? 'center' : 'left',
              width: '100%',
            }}
          >
            {displayDescription}
          </Typography>
        )}

        {showDetails && details && (
          <Box sx={{ mt: 2, width: '100%', maxWidth: 500 }}>
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              startIcon={expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 500, px: 0, color: 'text.secondary' }}
            >
              {expanded ? 'Hide Details' : 'Show Details'}
            </Button>
            <Collapse in={expanded} sx={{ mt: 1 }}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'left', bgcolor: '#FAFAFA', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                  Error Details
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'text.secondary' }}>
                  {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
                </Typography>
              </Paper>
            </Collapse>
          </Box>
        )}

        {(isRecoverable || actionButtons || onDismiss) && (
          <Box sx={{ mt: sizeStyles[size].gap, display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
            {actionButtons?.map((btn, idx) => (
              <Button
                key={idx}
                variant={btn.variant || 'outlined'}
                color={btn.color || 'primary'}
                size="medium"
                onClick={btn.onClick}
                disabled={btn.disabled || (btn === actionButtons[0] && retrying)}
                startIcon={btn.startIcon}
                endIcon={btn.endIcon}
                sx={{
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                }}
              >
                {btn.loading ? 'Loading...' : btn.label}
              </Button>
            ))}

            {isRecoverable && (
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleRetry}
                disabled={retrying}
                startIcon={retrying ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <Refresh />}
                sx={{ borderRadius: 3, fontWeight: 600, textTransform: 'none', px: 3, py: 1 }}
              >
                {retrying ? 'Retrying...' : retryLabel}
              </Button>
            )}

            {onDismiss && (
              <Button
                variant="outlined"
                color="inherit"
                size="medium"
                onClick={handleDismiss}
                sx={{ borderRadius: 3, fontWeight: 600, textTransform: 'none', px: 3, py: 1 }}
              >
                {dismissLabel}
              </Button>
            )}
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

export function useErrorHandler(defaultOnRetry, defaultOnDismiss) {
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);

  const handleError = useCallback((err, options = {}) => {
    const type = options.type || getErrorType(err);
    setErrorType(type);
    setError(err);
    options.onError?.(err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setErrorType(null);
    defaultOnDismiss?.();
  }, [defaultOnDismiss]);

  const retry = useCallback(async () => {
    if (defaultOnRetry) {
      try {
        await defaultOnRetry();
        clearError();
      } catch (err) {
        handleError(err);
      }
    }
  }, [defaultOnRetry, clearError, handleError]);

  return {
    error,
    errorType,
    handleError,
    clearError,
    retry,
    hasError: !!error,
  };
}

export function withErrorBoundary(WrappedComponent, errorBoundaryProps = {}) {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export { errorTypes, getErrorType };