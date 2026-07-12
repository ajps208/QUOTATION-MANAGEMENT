import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function AppDialog({ 
  open, 
  onClose, 
  title, 
  children, 
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  ...props
}) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={maxWidth} 
      fullWidth={fullWidth}
      {...props}
    >
      <DialogTitle sx={{ m: 0, p: 4, px: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" component="div" fontWeight={700}>
          {title}
        </Typography>
        {onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 5 }}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ p: 4, px: 5, gap: 2 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
