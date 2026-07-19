'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LinearProgress, Box } from '@mui/material';

export function PageTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!pathname) return;

    setLoading(true);
    setProgress(0);

    const startInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 150);

    const completeTimeout = setTimeout(() => {
      setProgress(100);
      clearInterval(startInterval);

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    }, 600);

    return () => {
      clearInterval(startInterval);
      clearTimeout(completeTimeout);
    };
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1400, height: 3, pointerEvents: 'none' }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 3,
          borderRadius: 0,
          backgroundColor: 'transparent',
          '& .MuiLinearProgress-bar': {
            borderRadius: 0,
            background: 'linear-gradient(90deg, #1F6B47, #68AE8E)',
          },
        }}
      />
    </Box>
  );
}

export default PageTransitionLoader;
