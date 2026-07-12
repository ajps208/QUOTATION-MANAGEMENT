import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmColor = 'error',
  loading = false,
}) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pt: 5, px: 5, pb: 2, fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent sx={{ px: 5, pb: 5, pt: 1 }}>
        <DialogContentText sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 5, pb: 5, gap: 2 }}>
        <Button onClick={onCancel} color="inherit" disabled={loading} size="large">
          {cancelLabel}
        </Button>
        <Button 
          onClick={onConfirm} 
          color={confirmColor} 
          variant="contained" 
          disabled={loading}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
