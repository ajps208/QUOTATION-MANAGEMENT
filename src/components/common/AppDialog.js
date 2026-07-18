import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
  ...props
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
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
        {onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: '#A2A8A4',
              mt: -0.5,
              '&:hover': { bgcolor: '#F6F6F6', color: '#5F6B62' },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers={dividers} sx={{ p: 3 }}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
