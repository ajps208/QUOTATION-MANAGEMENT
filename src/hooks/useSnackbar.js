import { create } from 'zustand';

export const useSnackbarStore = create((set) => ({
  open: false,
  message: '',
  severity: 'info', // 'success', 'error', 'warning', 'info'
  
  showSnackbar: (message, severity = 'info') => 
    set({ open: true, message, severity }),
    
  closeSnackbar: () => 
    set({ open: false }),
}));

export function useSnackbar() {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  
  return {
    showSuccess: (msg) => showSnackbar(msg, 'success'),
    showError: (msg) => showSnackbar(msg, 'error'),
    showWarning: (msg) => showSnackbar(msg, 'warning'),
    showInfo: (msg) => showSnackbar(msg, 'info'),
  };
}
