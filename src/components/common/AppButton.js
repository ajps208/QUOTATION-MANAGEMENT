'use client';

import { Button, CircularProgress, Box } from '@mui/material';

export default function AppButton({
  children,
  loading = false,
  disabled = false,
  loadingText,
  startIcon,
  endIcon,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  sx = {},
  loadingPosition = 'start',
  showLoadingText = true,
  ...props
}) {
  const isLoading = loading || disabled;

  const sizeStyles = {
    small: { spinnerSize: 16, iconGap: 0.5, fontSize: '0.8125rem', px: 2, py: 0.5 },
    medium: { spinnerSize: 18, iconGap: 0.5, fontSize: '0.875rem', px: 2.5, py: 0.75 },
    large: { spinnerSize: 22, iconGap: 0.75, fontSize: '0.9375rem', px: 3, py: 1 },
  };

  const style = sizeStyles[size];

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={isLoading}
      startIcon={loading && loadingPosition === 'start' ? (
        <CircularProgress size={style.spinnerSize} color="inherit" sx={{ mr: style.iconGap }} />
      ) : startIcon}
      endIcon={loading && loadingPosition === 'end' ? (
        <CircularProgress size={style.spinnerSize} color="inherit" sx={{ ml: style.iconGap }} />
      ) : endIcon}
      sx={{
        borderRadius: size === 'small' ? 2.5 : 3,
        fontWeight: 600,
        letterSpacing: '0.01em',
        textTransform: 'none',
        fontSize: style.fontSize,
        px: style.px,
        py: style.py,
        boxShadow: variant === 'contained' ? undefined : 'none',
        minWidth: loading && showLoadingText ? 140 : undefined,
        transition: 'all 0.2s ease',
        '&:disabled': {
          opacity: loading ? 0.85 : 0.6,
        },
        ...sx,
      }}
      {...props}
    >
      {loading && showLoadingText && loadingText ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: style.iconGap }}>
          {loadingPosition === 'start' && <CircularProgress size={style.spinnerSize} color="inherit" />}
          {loadingText}
          {loadingPosition === 'end' && <CircularProgress size={style.spinnerSize} color="inherit" />}
        </Box>
      ) : (
        children
      )}
    </Button>
  );
}

export function LoadingButton({
  children,
  loading = false,
  loadingText = 'Loading...',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  onClick,
  disabled = false,
  sx = {},
  ...props
}) {
  return (
    <AppButton
      loading={loading}
      loadingText={loadingText}
      disabled={disabled}
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      sx={{
        position: 'relative',
        minWidth: loading ? 140 : undefined,
        ...sx,
      }}
      {...props}
    >
      {children}
    </AppButton>
  );
}

export function SaveButton({ loading = false, onClick, disabled = false, sx = {}, ...props }) {
  return (
    <LoadingButton
      loading={loading}
      loadingText="Saving..."
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
      startIcon={<SaveIcon />}
      sx={{
        minWidth: 140,
        ...sx,
      }}
      {...props}
    >
      Save
    </LoadingButton>
  );
}

export function SendButton({ loading = false, onClick, disabled = false, sx = {}, ...props }) {
  return (
    <LoadingButton
      loading={loading}
      loadingText="Sending..."
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
      startIcon={<SendIcon />}
      sx={{
        minWidth: 140,
        ...sx,
      }}
      {...props}
    >
      Send
    </LoadingButton>
  );
}

export function UpdateButton({ loading = false, onClick, disabled = false, sx = {}, ...props }) {
  return (
    <LoadingButton
      loading={loading}
      loadingText="Updating..."
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
      startIcon={<SaveIcon />}
      sx={{
        minWidth: 140,
        ...sx,
      }}
      {...props}
    >
      Update
    </LoadingButton>
  );
}

export function DeleteButton({ loading = false, onClick, disabled = false, sx = {}, ...props }) {
  return (
    <LoadingButton
      loading={loading}
      loadingText="Deleting..."
      variant="contained"
      color="error"
      onClick={onClick}
      disabled={disabled}
      startIcon={<DeleteIcon />}
      sx={{
        minWidth: 140,
        ...sx,
      }}
      {...props}
    >
      Delete
    </LoadingButton>
  );
}

export function CreateButton({ loading = false, onClick, disabled = false, sx = {}, ...props }) {
  return (
    <LoadingButton
      loading={loading}
      loadingText="Creating..."
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
      startIcon={<AddIcon />}
      sx={{
        minWidth: 140,
        ...sx,
      }}
      {...props}
    >
      Create
    </LoadingButton>
  );
}

export function SubmitButton({ loading = false, onClick, disabled = false, sx = {}, ...props }) {
  return (
    <LoadingButton
      loading={loading}
      loadingText="Submitting..."
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
      startIcon={<SendIcon />}
      sx={{
        minWidth: 140,
        ...sx,
      }}
      {...props}
    >
      Submit
    </LoadingButton>
  );
}

export function ActionButton({
  children,
  loading = false,
  loadingText,
  action = 'Loading...',
  variant = 'contained',
  color = 'primary',
  onClick,
  disabled = false,
  startIcon,
  endIcon,
  sx = {},
  ...props
}) {
  return (
    <LoadingButton
      loading={loading}
      loadingText={loadingText || action}
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        minWidth: 120,
        ...sx,
      }}
      {...props}
    >
      {children}
    </LoadingButton>
  );
}

function SaveIcon({ fontSize = 'small', ...props }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" style={{ fontSize, verticalAlign: 'middle' }} {...props}>
      <path fill="currentColor" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
    </svg>
  );
}

function SendIcon({ fontSize = 'small', ...props }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" style={{ fontSize, verticalAlign: 'middle' }} {...props}>
      <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  );
}

function DeleteIcon({ fontSize = 'small', ...props }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" style={{ fontSize, verticalAlign: 'middle' }} {...props}>
      <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  );
}

function AddIcon({ fontSize = 'small', ...props }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" style={{ fontSize, verticalAlign: 'middle' }} {...props}>
      <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  );
}