'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';
import GlobalSnackbar from '@/components/common/GlobalSnackbar';

export default function Providers({ children }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: false }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <GlobalSnackbar />
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
