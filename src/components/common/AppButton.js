import { Button, CircularProgress } from '@mui/material';

export default function AppButton({
  children,
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  sx = {},
  ...props
}) {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" sx={{ mr: 0.5 }} /> : startIcon}
      endIcon={endIcon}
      sx={{
        borderRadius: size === 'small' ? 2.5 : size === 'large' ? 3 : 3,
        fontWeight: 600,
        letterSpacing: '0.01em',
        textTransform: 'none',
        boxShadow: variant === 'contained' ? undefined : 'none',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
