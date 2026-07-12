import { Button, CircularProgress } from '@mui/material';

export default function AppButton({ 
  children, 
  loading = false, 
  disabled = false, 
  startIcon, 
  endIcon, 
  variant = 'contained', 
  color = 'primary', 
  ...props 
}) {
  return (
    <Button
      variant={variant}
      color={color}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      endIcon={endIcon}
      {...props}
    >
      {children}
    </Button>
  );
}
