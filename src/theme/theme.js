'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5', // Indigo 600
      light: '#818cf8', // Indigo 400
      dark: '#3730a3', // Indigo 800
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0ea5e9', // Sky 500
      light: '#38bdf8', // Sky 400
      dark: '#0369a1', // Sky 700
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Slate 900
      secondary: '#475569', // Slate 600
    },
    success: {
      main: '#10b981', // Emerald 500
      light: '#d1fae5',
      dark: '#047857',
    },
    warning: {
      main: '#f59e0b', // Amber 500
      light: '#fef3c7',
      dark: '#b45309',
    },
    error: {
      main: '#ef4444', // Red 500
      light: '#fee2e2',
      dark: '#b91c1c',
    },
    info: {
      main: '#3b82f6', // Blue 500
      light: '#dbeafe',
      dark: '#1d4ed8',
    },
    divider: '#e2e8f0', // Slate 200
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'var(--font-inter), Arial, sans-serif',
    h1: { fontWeight: 600, fontSize: '2.5rem', lineHeight: 1.2, letterSpacing: '-0.02em' },
    h2: { fontWeight: 600, fontSize: '2rem', lineHeight: 1.2, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, fontSize: '1.75rem', lineHeight: 1.3, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.3, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.3 },
    h6: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.3 },
    subtitle1: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.6 },
    subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.6 },
    body1: { fontSize: '1rem', lineHeight: 1.8, letterSpacing: '0.01em', color: '#1e293b' },
    body2: { fontSize: '0.875rem', lineHeight: 1.8, letterSpacing: '0.01em', color: '#475569' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em', lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          },
        },
        sizeSmall: {
          padding: '6px 16px',
        },
        sizeLarge: {
          padding: '14px 32px',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 8px 16px -4px rgba(79,70,229,0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
          border: '1px solid #f1f5f9', // Slate 100
          overflow: 'visible',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '32px',
          '&:last-child': {
            paddingBottom: '32px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#64748b',
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#ffffff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e2e8f0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#cbd5e1',
          },
          '&.Mui-focusVisible .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4f46e5',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #f1f5f9',
          padding: '24px 24px',
        },
        head: {
          fontWeight: 600,
          color: '#64748b',
          backgroundColor: '#f8fafc',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
        },
      },
    },
  },
});

export default theme;
