'use client';

import { Component, createElement } from 'react';
import { Box, Button, Paper, Typography, Stack, Alert, IconButton } from '@mui/material';
import { Refresh, Error, Home, Info, Close, BugReport } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/hooks/useSnackbar';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo,
    });

    console.error('ErrorBoundary caught an error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1,
    });

    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    const router = this.router;
    if (router) {
      router.push(this.props.fallbackPath || '/business');
    } else {
      window.location.href = this.props.fallbackPath || '/business';
    }
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, retryCount } = this.state;
      const { fallback, fallbackPath = '/business', showDetails = process.env.NODE_ENV === 'development', onErrorReported } = this.props;

      if (fallback) {
        return createElement(fallback, { error, errorInfo, retry: this.handleRetry, reload: this.handleReload, goHome: this.handleGoHome });
      }

      return (
        <ErrorBoundaryFallback
          error={error}
          errorInfo={errorInfo}
          retryCount={retryCount}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
          showDetails={showDetails}
          fallbackPath={fallbackPath}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorBoundaryFallback({
  error,
  errorInfo,
  retryCount,
  onRetry,
  onReload,
  onGoHome,
  showDetails,
  fallbackPath,
}) {
  const router = useRouter();
  const { showError } = useSnackbar();

  const handleReportError = () => {
    const errorReport = {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount,
    };

    console.error('Error reported:', errorReport);
    showError('Error reported. Our team has been notified.');
    
    if (onErrorReported) {
      onErrorReported(errorReport);
    }
  };

  const isNetworkError = error?.message?.includes('Network') || error?.message?.includes('fetch');
  const isChunkLoadError = error?.message?.includes('ChunkLoadError') || error?.message?.includes('Loading chunk');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, md: 4 },
        py: 4,
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          width: '100%',
          p: { xs: 3, md: 4 },
          borderRadius: 3,
        }}
      >
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: isNetworkError ? 'warning.light' : 'error.light',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 'auto',
          }}>
            {isNetworkError ? (
              <Error sx={{ fontSize: 40, color: 'warning.main' }} />
            ) : isChunkLoadError ? (
              <Refresh sx={{ fontSize: 40, color: 'error.main' }} />
            ) : (
              <BugReport sx={{ fontSize: 40, color: 'error.main' }} />
            )}
          </Box>

          <Stack spacing={1.5} width="100%">
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '-0.01em',
              }}
            >
              {isNetworkError ? 'Connection Lost' : isChunkLoadError ? 'Update Available' : 'Something Went Wrong'}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              {isNetworkError 
                ? 'Unable to connect to the server. Please check your internet connection and try again.'
                : isChunkLoadError
                ? 'A new version of the application is available. Please refresh the page to load the latest updates.'
                : 'An unexpected error occurred. Our team has been notified. You can try refreshing the page or going back to the dashboard.'
              }
            </Typography>
          </Stack>

          {showDetails && error && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                width: '100%',
                textAlign: 'left',
                bgcolor: '#FAFAFA',
                borderRadius: 2,
                borderColor: 'divider',
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                Error Details
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  lineHeight: 1.6,
                }}
              >
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </Typography>
            </Paper>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} width="100%" sx={{ mt: 1 }}>
            {isNetworkError && (
              <Button
                variant="contained"
                size="large"
                onClick={onRetry}
                startIcon={<Refresh />}
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  fontWeight: 600,
                  py: 1.25,
                  fontSize: '0.9375rem',
                }}
              >
                Try Again
              </Button>
            )}

            {isChunkLoadError && (
              <Button
                variant="contained"
                size="large"
                onClick={onReload}
                startIcon={<Refresh />}
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  fontWeight: 600,
                  py: 1.25,
                  fontSize: '0.9375rem',
                }}
              >
                Refresh Page
              </Button>
            )}

            {!isNetworkError && !isChunkLoadError && (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onRetry}
                  startIcon={<Refresh />}
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    fontWeight: 600,
                    py: 1.25,
                    fontSize: '0.9375rem',
                  }}
                >
                  {retryCount > 0 ? `Retry (${retryCount})` : 'Try Again'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onReload}
                  startIcon={<Refresh />}
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    fontWeight: 600,
                    py: 1.25,
                    fontSize: '0.9375rem',
                  }}
                >
                  Reload Page
                </Button>
              </>
            )}

            <Button
              variant="outlined"
              size="large"
              onClick={onGoHome}
              startIcon={<Home />}
              sx={{
                flex: { xs: '1 1 100%', sm: '0 0 auto' },
                borderRadius: 3,
                fontWeight: 600,
                py: 1.25,
                fontSize: '0.9375rem',
              }}
            >
              Go to Dashboard
            </Button>
          </Stack>

          <Button
            variant="text"
            size="small"
            onClick={handleReportError}
            startIcon={<Info fontSize="small" />}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            Report this Error
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default ErrorBoundary;

export function withErrorBoundary(Component, errorBoundaryProps = {}) {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export function createErrorBoundary(fallbackComponent, props = {}) {
  return class CustomErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ errorInfo });
      props.onError?.(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return createElement(fallbackComponent, {
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          reset: () => this.setState({ hasError: false, error: null, errorInfo: null }),
          ...props,
        });
      }

      return this.props.children;
    }
  };
}