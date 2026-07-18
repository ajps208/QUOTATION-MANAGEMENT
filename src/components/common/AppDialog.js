'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box, Stack, Button, Alert, LinearProgress, Skeleton, Paper, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Refresh, Error, CheckCircle, Info } from '@mui/icons-material';

export default function AppDialog({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen = false,
  dividers = true,
  loading = false,
  loadingText = 'Loading...',
  error,
  onRetry,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  scroll = 'paper',
  PaperProps,
  ...props
}) {
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' && disableBackdropClick) return;
    if (reason === 'escapeKeyDown' && disableEscapeKeyDown) return;
    onClose?.(event, reason);
  };

  const handleBackdropClick = (event) => {
    event.preventDefault();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
      scroll={scroll}
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          ...PaperProps?.sx,
        },
        ...PaperProps,
      }}
      {...props}
    >
      <DialogTitle
        sx={{
          m: 0,
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          position: 'relative',
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              letterSpacing: '-0.01em',
              lineHeight: 1.4,
              fontSize: '1.125rem',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, lineHeight: 1.5, fontSize: '0.8125rem' }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {onClose && !loading && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={loading}
            sx={{
              color: '#A2A8A4',
              mt: -0.5,
              '&:hover': { bgcolor: '#F6F6F6', color: '#5F6B62' },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
        {loading && (
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 }}>
            <LinearProgress
              variant="indeterminate"
              sx={{ height: 2, borderRadius: 0, bgcolor: 'transparent' }}
            />
          </Box>
        )}
      </DialogTitle>

      <DialogContent dividers={dividers} sx={{ p: 3, position: 'relative' }}>
        {error && (
          <Box sx={{ mb: 3 }}>
            <Alert
              severity="error"
              icon={<Error fontSize="small" />}
              action={
                onRetry && (
                  <Button
                    size="small"
                    onClick={onRetry}
                    variant="outlined"
                    color="inherit"
                    sx={{ fontWeight: 600, textTransform: 'none' }}
                  >
                    <Refresh sx={{ mr: 0.5, fontSize: 16 }} />
                    Retry
                  </Button>
                )
              }
              sx={{ borderRadius: 2, fontSize: '0.875rem' }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {loading && !error ? (
          <DialogSkeleton />
        ) : (
          <Box sx={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}>
            {children}
          </Box>
        )}
      </DialogContent>

      {actions && !loading && (
        <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
          {actions}
        </DialogActions>
      )}

      {loading && actions && (
        <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
          {actions.map((action, index) => 
            action && action.type && action.props?.children ? (
              <Button
                key={index}
                variant={action.props.variant || 'outlined'}
                color={action.props.color || 'primary'}
                size={action.props.size || 'medium'}
                disabled={true}
                sx={{
                  minWidth: 120,
                  opacity: 0.7,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid currentColor', borderRadius: '50%', borderRightColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                  {action.props.children}
                </Box>
              </Button>
            ) : (
              <Box key={index} sx={{ minWidth: 120 }}>
                <Skeleton variant="text" width={120} height={40} variant="rounded" />
              </Box>
            )
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}

function DialogSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Grid container spacing={2.5} columns={2}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Stack direction="column" spacing={0.5}>
              <Skeleton variant="text" width="30%" height={16} sx={{ mb: 0.25 }} />
              <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
            </Stack>
          </Grid>
        ))}
      </Grid>
      
      <Divider />
      
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
        <Stack direction="column" spacing={1}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, py: 1, alignItems: 'center' }}>
              {i === 0 && <Skeleton variant="text" width="5%" height={20} />}
              <Skeleton variant="text" width="30%" height={18} />
              <Skeleton variant="text" width="15%" height={16} />
              <Skeleton variant="text" width="20%" height={16} align="right" />
              <Skeleton variant="text" width="20%" height={18} align="right" sx={{ fontWeight: 600 }} />
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmColor = 'error',
  variant = 'default',
  loading = false,
  confirmIcon,
  description,
  dangerMode = false,
}) {
  const variants = {
    default: {},
    destructive: {
      titleColor: 'error.main',
      confirmColor: 'error',
      icon: <Error sx={{ fontSize: 48, color: 'error.main' }} />,
    },
    info: {
      titleColor: 'info.main',
      confirmColor: 'info',
      icon: <Info sx={{ fontSize: 48, color: 'info.main' }} />,
    },
    success: {
      titleColor: 'success.main',
      confirmColor: 'success',
      icon: <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />,
    },
  };

  const variantConfig = variants[variant] || variants.default;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
    >
      <DialogTitle
        sx={{
          m: 0,
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1,
          textAlign: 'center',
        }}
      >
        {variantConfig.icon && (
          <Box sx={{ mb: 1 }}>{variantConfig.icon}</Box>
        )}
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: variantConfig.titleColor || 'text.primary',
            pb: 1,
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent dividers={true} sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="body1"
          sx={{
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: '#5F6B62',
            mb: description ? 2 : 0,
          }}
        >
          {message}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6, fontSize: '0.8125rem' }}
          >
            {description}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          color="inherit"
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: 3, fontWeight: 600, minWidth: 100 }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          color={variantConfig.confirmColor || confirmColor}
          variant="contained"
          disabled={loading}
          startIcon={loading ? (
            <span style={{ width: 16, height: 16, border: '2px solid currentColor', borderRadius: '50%', borderRightColor: 'transparent', animation: 'spin 1s linear infinite' }} />
          ) : confirmIcon}
          sx={{ borderRadius: 3, fontWeight: 600, minWidth: 120 }}
        >
          {loading ? 'Processing...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function FormDialog({
  open,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel = 'Save',
  submitIcon,
  cancelLabel = 'Cancel',
  loading = false,
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen = false,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  scroll = 'paper',
  validate,
  initialValues,
}) {
  const [formError, setFormError] = useState(null);
  const [formValues, setFormValues] = useState(initialValues || {});

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    
    if (validate) {
      const errors = validate(formValues);
      if (Object.keys(errors).length > 0) {
        setFormError('Please fix the validation errors');
        return;
      }
    }

    try {
      await onSubmit?.(formValues);
    } catch (err) {
      setFormError(err.message || 'Failed to submit. Please try again.');
    }
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      disableBackdropClick={disableBackdropClick || loading}
      disableEscapeKeyDown={disableEscapeKeyDown || loading}
      scroll={scroll}
      loading={loading}
      error={formError}
      actions={[
        <Button
          key="cancel"
          onClick={onClose}
          color="inherit"
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: 3, fontWeight: 600 }}
        >
          {cancelLabel}
        </Button>,
        <Button
          key="submit"
          type="submit"
          form="form-dialog-form"
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={submitIcon}
          sx={{ borderRadius: 3, fontWeight: 600, minWidth: 130 }}
        >
          {loading ? 'Saving...' : submitLabel}
        </Button>,
      ]}
    >
      <form id="form-dialog-form" onSubmit={handleSubmit} noValidate>
        {children}
      </form>
    </AppDialog>
  );
}

export function AsyncDialog({
  open,
  onClose,
  title,
  subtitle,
  children,
  loading = false,
  loadingText = 'Loading...',
  error,
  onRetry,
  actions,
  maxWidth = 'md',
  fullWidth = true,
  fullScreen = false,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
}) {
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      disableBackdropClick={disableBackdropClick || loading}
      disableEscapeKeyDown={disableEscapeKeyDown || loading}
      loading={loading}
      loadingText={loadingText}
      error={error}
      onRetry={onRetry}
      actions={actions}
    >
      {children}
    </AppDialog>
  );
}