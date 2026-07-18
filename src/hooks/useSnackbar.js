'use client';

import { useMemo, useCallback } from 'react';
import { create } from 'zustand';

let snackbarId = 0;

export const useSnackbarStore = create((set, get) => ({
  open: false,
  message: '',
  severity: 'info',
  action: null,
  actionLabel: '',
  progress: null,
  id: 0,
  
  showSnackbar: (message, severity = 'info', options = {}) => {
    const id = ++snackbarId;
    set({ 
      open: true, 
      message, 
      severity, 
      action: options.onAction || null,
      actionLabel: options.actionLabel || '',
      progress: options.progress || null,
      id,
    });
    return id;
  },
  
  updateProgress: (id, progress) => {
    const state = get();
    if (state.id === id) {
      set({ progress });
    }
  },
  
  closeSnackbar: (id) => {
    const state = get();
    if (!id || state.id === id) {
      set({ open: false, action: null, actionLabel: '', progress: null });
    }
  },
}));

export function useSnackbar() {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const updateProgress = useSnackbarStore((state) => state.updateProgress);
  const closeSnackbar = useSnackbarStore((state) => state.closeSnackbar);
  
  return useMemo(() => ({
    showSuccess: (msg, options) => showSnackbar(msg, 'success', options),
    showError: (msg, options) => showSnackbar(msg, 'error', options),
    showWarning: (msg, options) => showSnackbar(msg, 'warning', options),
    showInfo: (msg, options) => showSnackbar(msg, 'info', options),
    showLoading: (msg, options = {}) => showSnackbar(msg, 'info', { ...options, progress: 0 }),
    updateProgress: (id, progress) => updateProgress(id, progress),
    closeSnackbar: (id) => closeSnackbar(id),
    showWithAction: (msg, severity, actionLabel, onAction, options = {}) => 
      showSnackbar(msg, severity, { ...options, actionLabel, onAction }),
  }), [showSnackbar, updateProgress, closeSnackbar]);
}