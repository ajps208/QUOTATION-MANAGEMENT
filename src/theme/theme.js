import { createTheme } from '@mui/material/styles';

const palette = {
  primary: {
    main: '#1F6B47',
    light: '#D4EDE0',
    dark: '#07240D',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#5F6B62',
    light: '#ECECEC',
    dark: '#2A302D',
    contrastText: '#ffffff',
  },
  success: {
    main: '#1F6B47',
    light: '#D4EDE0',
    dark: '#07240D',
  },
  warning: {
    main: '#F4B740',
    light: '#FEF3D0',
    dark: '#7A5A00',
  },
  error: {
    main: '#E57373',
    light: '#FDE2E2',
    dark: '#8C2020',
  },
  info: {
    main: '#1F6B47',
    light: '#D4EDE0',
    dark: '#07240D',
  },
  background: {
    default: '#F6F6F6',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1E1E1E',
    secondary: '#5F6B62',
    disabled: '#A2A8A4',
  },
  divider: '#ECECEC',
  border: '#ECECEC',
  hover: '#F6F6F6',
  focus: '#D4EDE0',
  active: '#D4EDE0',
};

const theme = createTheme({
  palette,
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.375rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      color: palette.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: palette.text.secondary,
    },
    subtitle1: {
      fontSize: '0.9375rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.8125rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: palette.text.secondary,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      color: palette.text.secondary,
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: palette.text.secondary,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    '0 1px 3px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.03)',
    '0 2px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
    '0 4px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
    '0 8px 16px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.06)',
    '0 12px 24px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.07)',
    '0 16px 32px rgba(0,0,0,0.07), 0 20px 48px rgba(0,0,0,0.08)',
    '0 20px 40px rgba(0,0,0,0.08), 0 24px 56px rgba(0,0,0,0.09)',
    '0 24px 48px rgba(0,0,0,0.09), 0 28px 64px rgba(0,0,0,0.10)',
    '0 28px 56px rgba(0,0,0,0.10), 0 32px 72px rgba(0,0,0,0.11)',
    '0 32px 64px rgba(0,0,0,0.11), 0 36px 80px rgba(0,0,0,0.12)',
    '0 36px 72px rgba(0,0,0,0.12), 0 40px 88px rgba(0,0,0,0.13)',
    '0 40px 80px rgba(0,0,0,0.13), 0 44px 96px rgba(0,0,0,0.14)',
    '0 44px 88px rgba(0,0,0,0.14), 0 48px 104px rgba(0,0,0,0.15)',
    '0 48px 96px rgba(0,0,0,0.15), 0 52px 112px rgba(0,0,0,0.16)',
    '0 52px 104px rgba(0,0,0,0.16), 0 56px 120px rgba(0,0,0,0.17)',
    '0 56px 112px rgba(0,0,0,0.17), 0 60px 128px rgba(0,0,0,0.18)',
    '0 60px 120px rgba(0,0,0,0.18), 0 64px 136px rgba(0,0,0,0.19)',
    '0 64px 128px rgba(0,0,0,0.19), 0 68px 144px rgba(0,0,0,0.20)',
    '0 68px 136px rgba(0,0,0,0.20), 0 72px 152px rgba(0,0,0,0.21)',
    '0 72px 144px rgba(0,0,0,0.21), 0 76px 160px rgba(0,0,0,0.22)',
    '0 76px 152px rgba(0,0,0,0.22), 0 80px 168px rgba(0,0,0,0.23)',
    '0 80px 160px rgba(0,0,0,0.23), 0 84px 176px rgba(0,0,0,0.24)',
    '0 84px 168px rgba(0,0,0,0.24), 0 88px 184px rgba(0,0,0,0.25)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: {
          backgroundColor: palette.background.default,
          color: palette.text.primary,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '*, *::before, *::after': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#C8CCCA transparent',
        },
        '::-webkit-scrollbar': { width: 6, height: 6 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          background: '#C8CCCA',
          borderRadius: 4,
          '&:hover': { background: '#A2A8A4' },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, size: 'medium' },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          padding: '10px 20px',
          fontSize: '0.875rem',
          fontWeight: 600,
          letterSpacing: '0.01em',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'none',
          '&:hover': { transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
          '&.Mui-disabled': {
            opacity: 0.5,
            pointerEvents: 'none',
          },
        }),
        sizeSmall: { padding: '7px 14px', fontSize: '0.8125rem', borderRadius: 10 },
        sizeLarge: { padding: '13px 28px', fontSize: '0.9375rem', borderRadius: 12 },
        containedPrimary: {
          background: '#1F6B47',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(31,107,71,0.25), 0 1px 3px rgba(31,107,71,0.15)',
          '&:hover': {
            background: '#20724B',
            boxShadow: '0 4px 16px rgba(31,107,71,0.3), 0 2px 6px rgba(31,107,71,0.2)',
          },
          '&:active': {
            background: '#07240D',
          },
        },
        containedSecondary: {
          background: '#5F6B62',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(95,107,98,0.25)',
          '&:hover': {
            background: '#424A44',
            boxShadow: '0 4px 16px rgba(95,107,98,0.3)',
          },
        },
        containedError: {
          background: '#E57373',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(229,115,115,0.25)',
          '&:hover': {
            background: '#D45656',
            boxShadow: '0 4px 16px rgba(229,115,115,0.3)',
          },
        },
        outlinedPrimary: {
          borderWidth: 1.5,
          borderColor: palette.primary.main,
          color: palette.primary.main,
          backgroundColor: 'rgba(31,107,71,0.02)',
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: palette.primary.light,
            borderColor: palette.primary.main,
          },
        },
        outlinedSecondary: {
          borderWidth: 1.5,
          borderColor: palette.secondary.main,
          color: palette.secondary.main,
          backgroundColor: 'rgba(95,107,98,0.02)',
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: palette.secondary.light,
            borderColor: palette.secondary.main,
          },
        },
        textPrimary: {
          color: palette.primary.main,
          '&:hover': { backgroundColor: 'rgba(31,107,71,0.06)' },
        },
        textSecondary: {
          color: palette.text.secondary,
          '&:hover': { backgroundColor: 'rgba(95,107,98,0.06)' },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          width: 38,
          height: 38,
          transition: 'all 0.15s ease',
          '&:hover': { backgroundColor: palette.hover },
        }),
        sizeSmall: { width: 32, height: 32 },
        sizeMedium: { width: 38, height: 38 },
        sizeLarge: { width: 44, height: 44 },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          borderRadius: 16,
          backgroundColor: palette.background.paper,
          border: `1px solid ${palette.divider}`,
        }),
        elevation0: { boxShadow: 'none' },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
          border: `1px solid ${palette.divider}`,
        },
        elevation2: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
          border: `1px solid ${palette.divider}`,
        },
        outlined: {
          border: `1px solid ${palette.divider}`,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          border: `1px solid ${palette.divider}`,
          backgroundColor: palette.background.paper,
          backgroundImage: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '24px 24px 16px',
        },
        title: {
          fontSize: '1rem',
          fontWeight: 600,
          letterSpacing: '-0.005em',
        },
        subheader: {
          fontSize: '0.8125rem',
          marginTop: 4,
          color: palette.text.secondary,
        },
        action: {
          marginTop: -4,
          marginRight: -4,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '0 24px 24px',
          '&:last-child': { paddingBottom: 24 },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '12px 24px 20px',
          gap: 10,
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'medium', variant: 'outlined' },
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: palette.background.paper,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: 48,
            '& fieldset': {
              borderColor: '#E0E0E0',
              borderWidth: 1,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            '&:hover fieldset': {
              borderColor: '#C8CCCA',
            },
            '&.Mui-focused fieldset': {
              borderColor: palette.primary.main,
              borderWidth: 1.5,
              boxShadow: `0 0 0 3px rgba(31,107,71,0.1)`,
            },
            '&.Mui-error fieldset': {
              borderColor: palette.error.main,
              borderWidth: 1,
              boxShadow: 'none',
            },
            '&.Mui-error.Mui-focused fieldset': {
              borderColor: palette.error.main,
              borderWidth: 1.5,
              boxShadow: `0 0 0 3px rgba(229,115,115,0.1)`,
            },
            '& input, & textarea': {
              fontSize: '0.9375rem',
              padding: '13px 14px',
              '&::placeholder': {
                color: '#B5BAB7',
                opacity: 1,
              },
              '&:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 100px ${palette.background.paper} inset`,
                WebkitTextFillColor: palette.text.primary,
                borderRadius: 'inherit',
              },
            },
            '& input[type="date"]': {
              minHeight: 20,
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: palette.text.secondary,
            lineHeight: '1.4375em',
            '&.Mui-focused': {
              color: palette.primary.main,
              fontWeight: 600,
            },
            '&.Mui-error': {
              color: palette.error.main,
            },
          },
          '& .MuiFormHelperText-root': {
            fontSize: '0.75rem',
            marginTop: 6,
            marginLeft: 2,
            lineHeight: 1.4,
            '&.Mui-error': {
              color: palette.error.main,
            },
          },
          '& .MuiInputAdornment-root': {
            color: palette.text.disabled,
            marginTop: '0 !important',
            '& .MuiIconButton-root': {
              color: palette.text.secondary,
              width: 32,
              height: 32,
              marginRight: -4,
            },
          },
        }),
      },
    },
    MuiSelect: {
      defaultProps: { size: 'medium' },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          backgroundColor: palette.background.paper,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: 48,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0E0E0',
            borderWidth: 1,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C8CCCA',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.primary.main,
            borderWidth: 1.5,
            boxShadow: `0 0 0 3px rgba(31,107,71,0.1)`,
          },
        }),
        select: ({ theme }) => ({
          fontSize: '0.9375rem',
          padding: '13px 14px',
          display: 'flex',
          alignItems: 'center',
          minHeight: 20,
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '0.9375rem',
          padding: '10px 16px',
          borderRadius: 8,
          margin: '2px 6px',
          transition: 'all 0.15s ease',
          lineHeight: 1.5,
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          '&:hover': {
            backgroundColor: palette.hover,
          },
          '&.Mui-selected': {
            backgroundColor: palette.primary.light,
            color: palette.primary.dark,
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#B8DFCA',
            },
          },
          '&.Mui-focusVisible': {
            backgroundColor: palette.primary.light,
          },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: palette.text.secondary,
          marginBottom: 6,
          whiteSpace: 'normal',
          overflow: 'visible',
          textOverflow: 'clip',
          '&.Mui-focused': {
            color: palette.primary.main,
            fontWeight: 600,
          },
          '&.Mui-error': {
            color: palette.error.main,
          },
        },
        outlined: ({ theme }) => ({
          transform: 'translate(14px, 14px) scale(1)',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -6px) scale(0.75)',
            backgroundColor: palette.background.paper,
            padding: '0 4px',
          },
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          marginTop: 6,
          lineHeight: 1.4,
        },
        contained: {
          marginLeft: 0,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiInputLabel-root': {
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'clip',
          },
        }),
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: ({ theme }) => ({
          width: 42,
          height: 24,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: '0px',
            transitionDuration: '200ms',
            '&.Mui-checked': {
              transform: 'translateX(18px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: palette.primary.main,
                opacity: 1,
                border: 0,
              },
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.3,
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 18,
            height: 18,
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          },
          '& .MuiSwitch-track': {
            borderRadius: 12,
            backgroundColor: '#C8CCCA',
            opacity: 1,
            transition: 'background-color 200ms',
          },
        }),
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: '#D0D4D2',
          '&.Mui-checked': {
            color: palette.primary.main,
          },
          '&:hover': {
            backgroundColor: 'rgba(31,107,71,0.04)',
          },
        }),
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: '#D0D4D2',
          '&.Mui-checked': {
            color: palette.primary.main,
          },
        }),
      },
    },
    MuiChip: {
      defaultProps: { variant: 'filled' },
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 28,
          borderRadius: 10,
          letterSpacing: '0.01em',
          '&.MuiChip-outlined': {
            borderWidth: 1,
          },
        }),
        colorPrimary: {
          backgroundColor: palette.primary.light,
          color: palette.primary.dark,
          '&:hover': { backgroundColor: '#B8DFCA' },
        },
        colorSecondary: {
          backgroundColor: palette.secondary.light,
          color: palette.secondary.dark,
        },
        colorSuccess: {
          backgroundColor: palette.success.light,
          color: palette.success.dark,
        },
        colorWarning: {
          backgroundColor: palette.warning.light,
          color: palette.warning.dark,
        },
        colorError: {
          backgroundColor: palette.error.light,
          color: palette.error.dark,
        },
        colorInfo: {
          backgroundColor: palette.info.light,
          color: palette.info.dark,
        },
        deleteIcon: {
          color: 'currentColor',
          opacity: 0.6,
          '&:hover': { opacity: 1 },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '0.875rem',
          padding: '16px',
          borderBottom: `1px solid ${palette.divider}`,
          color: palette.text.primary,
          verticalAlign: 'middle',
        }),
        head: ({ theme }) => ({
          fontSize: '0.75rem',
          fontWeight: 600,
          color: palette.text.secondary,
          backgroundColor: '#FAFAFA',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderBottom: `1px solid ${palette.divider}`,
          whiteSpace: 'nowrap',
        }),
        paddingCheckbox: {
          width: 48,
          padding: '0 4px 0 12px',
          '& .MuiIconButton-root': {
            padding: 4,
            width: 32,
            height: 32,
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: '#FAFAFA',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: 'background-color 0.15s ease',
            '&:hover': { backgroundColor: 'rgba(246,246,246,0.8)' },
            '&:last-child .MuiTableCell-root': {
              borderBottom: 'none',
            },
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          borderTop: 'none',
          '& .MuiTablePagination-toolbar': {
            minHeight: 52,
            paddingLeft: 16,
            paddingRight: 8,
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.8125rem',
            color: palette.text.secondary,
          },
          '& .MuiIconButton-root': {
            width: 34,
            height: 34,
            borderRadius: 10,
            color: palette.text.secondary,
            '&:hover': { backgroundColor: palette.hover },
          },
        },
      },
    },
    MuiDialog: {
      defaultProps: { maxWidth: 'sm', fullWidth: true },
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 18,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
          border: `1px solid ${palette.divider}`,
          maxHeight: '85vh',
          margin: 16,
        }),
        paperFullWidth: {
          maxWidth: 720,
        },
        paperWidthXs: {
          maxWidth: 440,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '1.25rem',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          padding: '24px 24px 16px',
          lineHeight: 1.4,
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: '8px 24px 24px',
          overflowY: 'auto',
          '&.MuiDialogContent-dividers': {
            padding: '16px 24px',
            borderTop: `1px solid ${palette.divider}`,
            borderBottom: `1px solid ${palette.divider}`,
          },
        }),
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: '16px 24px 24px',
          gap: 10,
          justifyContent: 'flex-end',
          borderTop: `1px solid ${palette.divider}`,
          '& > :first-of-type': { marginRight: 'auto' },
        }),
      },
    },
    MuiAlert: {
      defaultProps: { variant: 'standard' },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          padding: '12px 16px',
          fontSize: '0.875rem',
          border: '1px solid',
          '& .MuiAlert-icon': {
            fontSize: 20,
            marginTop: 1,
            marginRight: 12,
          },
          '& .MuiAlert-message': {
            padding: 0,
            width: '100%',
          },
          '& .MuiAlert-action': {
            paddingTop: 0,
            marginRight: -4,
            '& .MuiIconButton-root': {
              width: 28,
              height: 28,
              padding: 4,
              color: 'inherit',
              opacity: 0.7,
              '&:hover': { opacity: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
            },
          },
        }),
        standardSuccess: {
          backgroundColor: palette.success.light,
          color: palette.success.dark,
          borderColor: '#A8DBBF',
          '& .MuiAlert-icon': { color: palette.success.main },
        },
        standardError: {
          backgroundColor: palette.error.light,
          color: palette.error.dark,
          borderColor: '#F5BFBF',
          '& .MuiAlert-icon': { color: palette.error.main },
        },
        standardWarning: {
          backgroundColor: palette.warning.light,
          color: palette.warning.dark,
          borderColor: '#F5DCA0',
          '& .MuiAlert-icon': { color: palette.warning.main },
        },
        standardInfo: {
          backgroundColor: palette.info.light,
          color: palette.info.dark,
          borderColor: '#A8DBBF',
          '& .MuiAlert-icon': { color: palette.info.main },
        },
        filledSuccess: {
          backgroundColor: palette.success.main,
          color: '#ffffff',
          border: 'none',
        },
        filledError: {
          backgroundColor: palette.error.main,
          color: '#ffffff',
          border: 'none',
        },
        filledWarning: {
          backgroundColor: palette.warning.main,
          color: '#ffffff',
          border: 'none',
        },
        filledInfo: {
          backgroundColor: palette.primary.main,
          color: '#ffffff',
          border: 'none',
        },
        outlinedSuccess: {
          color: palette.success.dark,
          border: `1.5px solid ${palette.success.main}`,
          backgroundColor: 'rgba(31,107,71,0.02)',
          '& .MuiAlert-icon': { color: palette.success.main },
        },
        outlinedError: {
          color: palette.error.dark,
          border: `1.5px solid ${palette.error.main}`,
          backgroundColor: 'rgba(229,115,115,0.02)',
          '& .MuiAlert-icon': { color: palette.error.main },
        },
        outlinedWarning: {
          color: palette.warning.dark,
          border: `1.5px solid ${palette.warning.main}`,
          backgroundColor: 'rgba(244,183,64,0.02)',
          '& .MuiAlert-icon': { color: palette.warning.main },
        },
        outlinedInfo: {
          color: palette.primary.dark,
          border: `1.5px solid ${palette.primary.main}`,
          backgroundColor: 'rgba(31,107,71,0.02)',
          '& .MuiAlert-icon': { color: palette.primary.main },
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        placement: 'top',
      },
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: '#1E1E1E',
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '6px 12px',
          borderRadius: 10,
          lineHeight: 1.5,
          maxWidth: 320,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }),
        arrow: {
          color: '#1E1E1E',
        },
        popper: {
          '&[data-popper-placement*="top"]': {
            marginBottom: 8,
          },
          '&[data-popper-placement*="bottom"]': {
            marginTop: 8,
          },
          '&[data-popper-placement*="left"]': {
            marginRight: 8,
          },
          '&[data-popper-placement*="right"]': {
            marginLeft: 8,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRight: `1px solid ${palette.divider}`,
          boxShadow: 'none',
        }),
        paperAnchorLeft: {
          borderRight: `1px solid ${palette.divider}`,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: ({ theme }) => ({
          backgroundColor: palette.error.main,
          color: '#ffffff',
          fontSize: '0.6875rem',
          fontWeight: 600,
          height: 20,
          minWidth: 20,
          padding: '0 5px',
          boxShadow: `0 0 0 2px ${palette.background.paper}`,
        }),
        dot: {
          height: 10,
          minWidth: 10,
          padding: 0,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: palette.primary.main,
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '0.875rem',
        }),
        colorDefault: ({ theme }) => ({
          background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.light} 100%)`,
          color: '#ffffff',
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: palette.divider,
        },
        light: {
          borderColor: palette.divider,
        },
        middle: {
          marginTop: 16,
          marginBottom: 16,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          backgroundColor: '#ECECEC',
          '&:after': {
            background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)',
          },
        }),
        rectangular: { borderRadius: 10 },
        circular: { borderRadius: '50%' },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          border: `1px solid ${palette.divider}`,
          boxShadow: 'none',
          '&:before': { display: 'none' },
          '&.Mui-expanded': {
            margin: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          },
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 48,
          padding: '0 16px',
          '&.Mui-expanded': {
            minHeight: 48,
          },
          '& .MuiTypography-root': {
            fontSize: '0.9375rem',
            fontWeight: 500,
          },
        }),
        content: ({ theme }) => ({
          margin: '12px 0',
          '&.Mui-expanded': {
            margin: '12px 0',
          },
        }),
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: '0 16px 16px',
        }),
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: palette.primary.main,
        }),
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 6,
          height: 6,
          backgroundColor: '#ECECEC',
          overflow: 'hidden',
        }),
        colorPrimary: {
          backgroundColor: '#ECECEC',
          '& .MuiLinearProgress-bar': {
            background: `linear-gradient(90deg, ${palette.primary.main} 0%, #68AE8E 100%)`,
          },
        },
      },
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      },
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          padding: '12px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          backgroundColor: '#1E1E1E',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }),
        message: {
          padding: 0,
        },
        action: {
          marginRight: -4,
          '& .MuiIconButton-root': {
            color: '#ffffff',
            opacity: 0.7,
            width: 28,
            height: 28,
            padding: 4,
            '&:hover': { opacity: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
          },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiTypography-root': {
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: palette.text.secondary,
          },
          '& .MuiLink-root': {
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: palette.text.secondary,
            textDecoration: 'none',
            transition: 'color 0.15s ease',
            '&:hover': { color: palette.primary.main },
          },
          '& .MuiBreadcrumbs-separator': {
            color: palette.text.disabled,
            margin: '0 4px',
          },
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '0.875rem',
          fontWeight: 500,
          color: palette.text.secondary,
          textTransform: 'none',
          minHeight: 44,
          padding: '10px 20px',
          borderRadius: '8px 8px 0 0',
          transition: 'all 0.2s ease',
          '&:hover': {
            color: palette.primary.main,
            backgroundColor: 'rgba(31,107,71,0.04)',
          },
          '&.Mui-selected': {
            color: palette.primary.main,
            fontWeight: 600,
          },
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '2px 2px 0 0',
            backgroundColor: palette.primary.main,
          },
        },
        scrollButtons: {
          '&.Mui-disabled': { opacity: 0.3 },
          '& .MuiSvgIcon-root': { fontSize: 20 },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          marginLeft: -2,
          '& .MuiFormControlLabel-label': {
            fontSize: '0.9375rem',
            fontWeight: 400,
            color: palette.text.primary,
          },
        }),
      },
    },
  },
});

export default theme;
