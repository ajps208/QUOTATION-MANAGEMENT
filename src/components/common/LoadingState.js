'use client';

import { Box, CircularProgress, Typography, Skeleton, LinearProgress, Stack, Paper, Card, CardContent, Grid, Divider, Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, InputBase, FormControl, InputLabel, Select, MenuItem, Button, Alert } from '@mui/material';
import { FormSkeleton, TableSkeleton } from './SkeletonLoaders';

export function LoadingState({
  variant = 'spinner',
  title = 'Loading...',
  description,
  size = 'md',
  fullScreen = false,
  overlay = false,
  skeletonCount = 4,
  skeletonVariant = 'card',
}) {
  const sizeStyles = {
    sm: { spinnerSize: 24, titleSize: '0.8125rem', descSize: '0.75rem', gap: 1, padding: 2 },
    md: { spinnerSize: 32, titleSize: '0.875rem', descSize: '0.8125rem', gap: 1.5, padding: 3 },
    lg: { spinnerSize: 48, titleSize: '1rem', descSize: '0.875rem', gap: 2, padding: 4 },
    xl: { spinnerSize: 64, titleSize: '1.125rem', descSize: '1rem', gap: 2.5, padding: 5 },
  };

  const style = sizeStyles[size];

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          zIndex: 1300,
          px: 2,
        }}
      >
        <LoadingContent />
      </Box>
    );
  }

  if (overlay) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          opacity: 0.8,
          zIndex: 10,
          borderRadius: 'inherit',
          px: 2,
        }}
      >
        <LoadingContent />
      </Box>
    );
  }

  return <LoadingContent />;

  function LoadingContent() {
    switch (variant) {
      case 'spinner':
        return (
          <Stack
            direction="column"
            spacing={style.gap}
            sx={{ py: style.padding, alignItems: 'center' }}
          >
            <CircularProgress size={style.spinnerSize} sx={{ color: 'primary.main' }} />
            <Stack direction="column" spacing={0.5} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: style.titleSize, fontWeight: 600, color: 'text.primary' }}>
                {title}
              </Typography>
              {description && (
                <Typography variant="body2" sx={{ fontSize: style.descSize, color: 'text.secondary', maxWidth: 300 }}>
                  {description}
                </Typography>
              )}
            </Stack>
          </Stack>
        );

      case 'inline':
        return (
          <Stack direction="row" spacing={1.5} sx={{ py: 1, alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontSize: style.titleSize, fontWeight: 500, color: 'text.primary' }}>
              {title}
            </Typography>
          </Stack>
        );

      case 'skeleton':
        return <SkeletonLoader count={skeletonCount} variant={skeletonVariant} />;

      case 'page':
        return (
          <Stack direction="column" spacing={3} sx={{ py: 6, px: 3, alignItems: 'center' }}>
            <CircularProgress size={48} sx={{ color: 'primary.main' }} />
            <Stack direction="column" spacing={1} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {title}
              </Typography>
              {description && (
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 400, lineHeight: 1.7 }}>
                  {description}
                </Typography>
              )}
            </Stack>
          </Stack>
        );

      case 'progress':
        return (
          <Stack direction="column" spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <CircularProgress size={24} sx={{ color: 'primary.main' }} />
              <Typography variant="body2" sx={{ fontSize: style.titleSize, fontWeight: 500, color: 'text.primary' }}>
                {title}
              </Typography>
            </Stack>
            <LinearProgress variant="determinate" value={0} sx={{ height: 6, borderRadius: 3 }} />
            {description && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: style.descSize }}>
                {description}
              </Typography>
            )}
          </Stack>
        );

      case 'button':
        return (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <CircularProgress size={18} color="inherit" />
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: style.titleSize }}>
              {title}
            </Typography>
          </Stack>
        );

      default:
        return (
          <Stack direction="column" spacing={style.gap} sx={{ py: style.padding, alignItems: 'center' }}>
            <CircularProgress size={style.spinnerSize} sx={{ color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontSize: style.titleSize, fontWeight: 500, color: 'text.primary' }}>
              {title}
            </Typography>
          </Stack>
        );
    }
  }
}

function SkeletonLoader({ count = 4, variant = 'card' }) {
  const variants = {
    card: () => (
      <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Skeleton variant="rectangular" width={44} height={44} sx={{ borderRadius: 3 }} />
                <Skeleton variant="rounded" width={60} height={24} />
              </Box>
              <Skeleton variant="text" width="40%" height={32} />
              <Skeleton variant="text" width="60%" height={16} />
              <Box sx={{ mt: 'auto', pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="text" width={80} height={24} />
                <Skeleton variant="rounded" width={60} height={32} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    ),
    dashboard: () => (
      <Grid container spacing={2} sx={{ width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: '16px !important', sm: '20px !important', md: '24px !important' }, display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                  <Skeleton variant="rectangular" width={44} height={44} sx={{ borderRadius: 3 }} />
                  <Skeleton variant="rounded" width={50} height={20} />
                </Box>
                <Skeleton variant="text" width="30%" height={40} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="60%" height={14} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    ),
    table: () => (
      <TableContainer sx={{ width: '100%' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {Array.from({ length: 7 }).map((_, i) => (
                <TableCell key={i} align={i > 0 ? 'center' : 'left'}>
                  <Skeleton variant="text" width={i === 0 ? '80%' : '60%'} height={16} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: count }).map((_, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {Array.from({ length: 7 }).map((_, colIndex) => (
                  <TableCell key={colIndex} align={colIndex > 0 ? 'center' : 'left'}>
                    <Skeleton variant="text" width={colIndex === 0 ? '70%' : '50%'} height={14} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ),
    list: () => (
      <List sx={{ px: 0, width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ borderBottom: i < count - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <ListItem disableGutters sx={{ py: 1.5 }}>
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton variant="text" width="60%" height={18} />}
                secondary={<Skeleton variant="text" width="40%" height={14} />}
              />
              <ListItemSecondaryAction>
                <Skeleton variant="circular" width={36} height={36} />
              </ListItemSecondaryAction>
            </ListItem>
          </Box>
        ))}
      </List>
    ),
    form: () => (
      <Stack direction="column" spacing={2.5} sx={{ width: '100%' }}>
        <Grid container spacing={2.5} columns={2}>
          {Array.from({ length: count }).map((_, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Stack direction="column" spacing={0.5}>
                <Skeleton variant="text" width="30%" height={16} sx={{ mb: 0.25 }} />
                <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
              </Stack>
            </Grid>
          ))}
        </Grid>
<Stack direction="row" spacing={1.5} sx={{ mt: 1, justifyContent: 'flex-end' }}>
            <Skeleton variant="rounded" width={80} height={40} />
            <Skeleton variant="rounded" width={100} height={40} />
        </Stack>
      </Stack>
    ),
    activity: () => (
      <Stack direction="column" spacing={0} sx={{ width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ borderBottom: i < count - 1 ? '1px solid' : 'none', borderColor: 'divider', py: 1.5 }}>
            <Stack direction="row" spacing={1.5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Skeleton variant="circular" width={12} height={12} sx={{ borderRadius: '50%', bgcolor: 'primary.main' }} />
                <Box sx={{ width: 2, height: '100%', bgcolor: 'divider', mt: 1, flex: 1 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton variant="text" width="70%" height={16} sx={{ mb: 0.25 }} />
                <Skeleton variant="text" width="40%" height={12} />
              </Box>
              <Skeleton variant="text" width={50} height={14} />
            </Stack>
          </Box>
        ))}
      </Stack>
    ),
    notification: () => (
      <List sx={{ px: 0, width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ borderBottom: i < count - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <ListItem disableGutters sx={{ py: 1.5 }}>
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Skeleton variant="text" width="50%" height={18} />
                    <Skeleton variant="text" width={60} height={14} />
                  </Stack>
                }
                secondary={<Skeleton variant="text" width="80%" height={14} />}
              />
              <ListItemSecondaryAction>
                <Skeleton variant="circular" width={36} height={36} />
              </ListItemSecondaryAction>
            </ListItem>
          </Box>
        ))}
      </List>
    ),
    search: () => (
      <Stack direction="column" spacing={1.5} sx={{ width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="50%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="30%" height={14} sx={{ mb: 0.25 }} />
              <Skeleton variant="text" width="40%" height={12} />
            </Box>
            <Skeleton variant="rounded" width={80} height={24} />
          </Card>
        ))}
      </Stack>
    ),
    modal: () => (
      <Paper
        sx={{
          width: 500,
          maxWidth: 'calc(100% - 32px)',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="60%" height={14} />
          </Box>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
        <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
          <Stack direction="column" spacing={2.5} sx={{ width: '100%' }}>
            <Grid container spacing={2.5} columns={2}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Stack direction="column" spacing={0.5}>
                    <Skeleton variant="text" width="30%" height={16} sx={{ mb: 0.25 }} />
                    <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Box>
<Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'flex-end', gap: 1.5, borderTop: 1, borderColor: 'divider' }}>
            <Skeleton variant="rounded" width={80} height={40} />
            <Skeleton variant="rounded" width={100} height={40} />
        </Box>
      </Paper>
    ),
  };

  return variants[variant] ? variants[variant]() : variants.card();
}

export function PageLoader({ title = 'Loading...', description, children }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LinearProgress
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          height: 3,
          borderRadius: 0,
        }}
        variant="indeterminate"
      />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
        <LoadingState variant="page" title={title} description={description} />
      </Box>
    </Box>
  );
}

export function SectionLoader({ title, variant = 'card', count = 3, sx }) {
  return (
    <Box sx={{ width: '100%', ...sx }}>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          {title}
        </Typography>
      )}
      <SkeletonLoader count={count} variant={variant} />
    </Box>
  );
}

export function InlineLoader({ text = 'Loading...', size = 'sm' }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <CircularProgress size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} color="inherit" />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {text}
      </Typography>
    </Stack>
  );
}

export function ButtonLoader({ children = 'Loading...', loading = false, disabled = false, ...props }) {
  return (
    <Button
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" sx={{ mr: 0.5 }} /> : undefined}
      {...props}
    >
      {loading ? children : props.children}
    </Button>
  );
}

export function DataTableLoader({ columns = 7, rows = 5, showToolbar = true, showPagination = true }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {showToolbar && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Skeleton variant="rectangular" width={300} height={48} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" width={140} height={44} />
            <Skeleton variant="rounded" width={140} height={44} />
            <Skeleton variant="rounded" width={140} height={44} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rounded" width={100} height={40} />
            <Skeleton variant="rounded" width={120} height={40} />
          </Box>
        </Box>
      )}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {Array.from({ length: columns }).map((_, i) => (
                  <TableCell key={i} align={i > 0 ? 'center' : 'left'}>
                    <Skeleton variant="text" width="60%" height={14} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex} hover>
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <TableCell key={colIndex} align={colIndex > 0 ? 'center' : 'left'}>
                      <Skeleton variant="text" width={colIndex === 0 ? '70%' : '50%'} height={14} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {showPagination && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 1, borderColor: 'divider' }}>
          <Skeleton variant="text" width="30%" height={16} />
          <Stack direction="row" spacing={1}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rounded" width={36} height={36} />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export function FormSectionLoader({ sections = 1, fieldsPerSection = 4, columns = 2 }) {
  return (
    <Stack direction="column" spacing={3} sx={{ width: '100%' }}>
      {Array.from({ length: sections }).map((_, sectionIndex) => (
        <Paper key={sectionIndex} variant="outlined" sx={{ p: 3 }}>
          <Grid container spacing={2.5} columns={columns}>
            {Array.from({ length: fieldsPerSection }).map((_, fieldIndex) => (
              <Grid item xs={12} sm={columns === 2 ? 6 : 4} key={fieldIndex}>
                <Stack direction="column" spacing={0.5}>
                  <Skeleton variant="text" width="30%" height={16} sx={{ mb: 0.25 }} />
                  <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
    </Stack>
  );
}

export function QuotationPreviewLoader() {
  return (
    <Paper variant="elevation" sx={{ p: 3, maxWidth: 800, mx: 'auto', width: '100%' }}>
      <Stack direction="column" spacing={3} sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Stack direction="column" spacing={0.5}>
            <Skeleton variant="text" width="30%" height={28} />
            <Skeleton variant="text" width="50%" height={16} />
          </Stack>
          <Stack direction="column" alignItems="flex-end" spacing={0.5}>
            <Skeleton variant="text" width="40%" height={16} />
            <Skeleton variant="text" width="60%" height={14} />
          </Stack>
        </Box>
        <Divider />
        <Stack direction="column" spacing={0.75} sx={{ width: '100%' }}>
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="80%" height={14} />
        </Stack>
        <Divider />
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><Skeleton variant="text" width="60%" height={14} /></TableCell>
                  <TableCell align="center"><Skeleton variant="text" width="40%" height={14} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width="60%" height={14} /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="text" width="70%" height={16} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width="40%" height={14} /></TableCell>
                    <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                    <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                    <TableCell align="right"><Skeleton variant="text" width="60%" height={16} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
<Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ width: '100%' }}>
            <Skeleton variant="rounded" width={100} height={40} />
            <Skeleton variant="rounded" width={120} height={40} />
        </Stack>
      </Stack>
    </Paper>
  );
}

export function DashboardStatsLoader({ count = 6 }) {
  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: '16px !important', sm: '20px !important', md: '24px !important' }, display: 'flex', flexDirection: 'column', gap: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                <Skeleton variant="rectangular" width={44} height={44} sx={{ borderRadius: 3 }} />
                <Skeleton variant="rounded" width={50} height={20} />
              </Box>
              <Skeleton variant="text" width="30%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="60%" height={14} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export function ChartLoader({ title, height = 300 }) {
  return (
    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, width: '100%' }}>
        <Skeleton variant="text" width={title ? '40%' : '30%'} height={20} />
        <Skeleton variant="rounded" width={100} height={28} />
      </Stack>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: height - 100 }}>
        <Stack direction="column" alignItems="center" spacing={1.5}>
          <CircularProgress size={48} sx={{ color: 'primary.main', opacity: 0.5 }} />
          <Typography variant="body2" color="text.secondary">Rendering chart...</Typography>
        </Stack>
      </Box>
    </Paper>
  );
}

export function ListDetailLoader({ showDetail = false }) {
  return (
    <Grid container spacing={2} sx={{ height: '100%', overflow: 'auto' }}>
      <Grid item xs={12} lg={7}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Skeleton variant="text" width="30%" height={20} />
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <SkeletonLoader count={8} variant="list" />
          </Box>
        </Paper>
      </Grid>
      {showDetail && (
        <Grid item xs={12} lg={5}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Skeleton variant="text" width="40%" height={20} />
                <Stack direction="row" spacing={1}>
                  <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
                </Stack>
              </Stack>
            </Box>
            <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
              <FormSkeleton fieldCount={4} columns={2} />
              <Divider sx={{ my: 2 }} />
              <TableSkeleton columns={7} rows={5} />
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}

export const TableLoader = DataTableLoader;

export default LoadingState;