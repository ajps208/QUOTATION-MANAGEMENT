'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Suspense } from 'react';
import theme from '@/theme/theme';
import GlobalSnackbar from '@/components/common/GlobalSnackbar';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { PageTransitionLoader } from '@/components/common/PageTransitionLoader';

export default function Providers({ children }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: false }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary fallbackPath="/business">
          {children}
        </ErrorBoundary>
        <Suspense fallback={null}>
          <PageTransitionLoader />
        </Suspense>
        <GlobalSnackbar />
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}