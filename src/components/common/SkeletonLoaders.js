'use client';

import { Box, Skeleton, Card, CardContent, Grid, Typography, Divider, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Chip, Avatar, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton, InputBase, FormControl, InputLabel, Select, MenuItem, Button, Paper, Accordion, AccordionSummary, AccordionDetails, LinearProgress, Stack } from '@mui/material';

export function CardSkeleton({ variant = 'default', count = 1 }) {
  const variants = {
    default: (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Skeleton variant="rectangular" width={44} height={44} sx={{ borderRadius: 3 }} />
            <Skeleton variant="circular" width={60} height={24} />
          </Box>
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={16} />
          <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="circular" width={60} height={32} />
          </Box>
        </CardContent>
      </Card>
    ),
    dashboard: (
      <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: '16px !important', sm: '20px !important', md: '24px !important' }, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
            <Skeleton variant="rectangular" width={44} height={44} sx={{ borderRadius: 3 }} />
            <Skeleton variant="circular" width={50} height={20} />
          </Box>
          <Skeleton variant="text" width="30%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="60%" height={14} />
        </CardContent>
      </Card>
    ),
    stat: (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2 }} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
          <Skeleton variant="text" width="80%" height={36} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="50%" height={16} />
        </CardContent>
      </Card>
    ),
    quickAction: (
      <Card sx={{ cursor: 'pointer', border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: { xs: '14px !important', sm: '16px !important' }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, textAlign: { xs: 'center', sm: 'left' }, gap: 1.5 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ borderRadius: 3 }} />
          <Box sx={{ width: '100%' }}>
            <Skeleton variant="text" width="70%" height={18} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="100%" height={14} />
          </Box>
        </CardContent>
      </Card>
    ),
    product: (
      <Card sx={{ p: 2.5, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Skeleton variant="text" width="80%" height={22} sx={{ mb: 0.5 }} />
          <Skeleton variant="circular" width={60} height={24} />
        </Box>
        <Skeleton variant="text" width="40%" height={14} sx={{ mb: 1, alignSelf: 'flex-start' }} />
        <Skeleton variant="circular" width={80} height={24} sx={{ alignSelf: 'flex-start', mb: 1 }} />
        <Skeleton variant="text" width="60%" height={14} sx={{ mb: 'auto' }} />
        <Box sx={{ mt: 'auto', pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width={100} height={24} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </Box>
      </Card>
    ),
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i}>{variants[variant]}</Box>
      ))}
    </Box>
  );
}

export function TableSkeleton({ columns = 7, rows = 5, compact = false }) {
  const defaultColumns = Array.from({ length: columns }, (_, i) => (
    <TableCell key={i} align={i > 0 ? 'center' : 'left'}>
      <Skeleton variant="text" width={i === 0 ? '80%' : '60%'} height={16} />
    </TableCell>
  ));

  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table size={compact ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            {defaultColumns}
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
  );
}

export function ListSkeleton({ itemCount = 5, variant = 'default', showAvatar = true, showSecondaryAction = false }) {
  const variants = {
    default: (
      <ListItem disableGutters sx={{ py: 1.5 }}>
        {showAvatar && (
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
        )}
        <ListItemText
          primary={<Skeleton variant="text" width="60%" height={18} />}
          secondary={<Skeleton variant="text" width="40%" height={14} />}
        />
        {showSecondaryAction && (
          <ListItemSecondaryAction>
            <Skeleton variant="circular" width={36} height={36} />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    ),
    dense: (
      <ListItem disableGutters sx={{ py: 0.75, dense: true }}>
        {showAvatar && (
          <ListItemAvatar>
            <Skeleton variant="circular" width={32} height={32} />
          </ListItemAvatar>
        )}
        <ListItemText
          primary={<Skeleton variant="text" width="50%" height={16} />}
          secondary={<Skeleton variant="text" width="35%" height={12} />}
        />
      </ListItem>
    ),
    activity: (
      <Box sx={{ display: 'flex', gap: 1.5, py: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Skeleton variant="circular" width={12} height={12} sx={{ borderRadius: '50%', bgcolor: 'primary.main' }} />
          <Box sx={{ width: 2, height: '100%', bgcolor: 'divider', mt: 1, flex: 1 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Skeleton variant="text" width="70%" height={16} sx={{ mb: 0.25 }} />
          <Skeleton variant="text" width="40%" height={12} />
        </Box>
        <Skeleton variant="text" width={50} height={14} />
      </Box>
    ),
    notification: (
      <ListItem disableGutters sx={{ py: 1.5 }}>
        {showAvatar && (
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
        )}
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Skeleton variant="text" width="50%" height={18} />
              <Skeleton variant="text" width={60} height={14} />
            </Box>
          }
          secondary={<Skeleton variant="text" width="80%" height={14} />}
        />
        {showSecondaryAction && (
          <ListItemSecondaryAction>
            <Skeleton variant="circular" width={36} height={36} />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    ),
  };

  return (
    <List sx={{ px: 0 }}>
      {Array.from({ length: itemCount }).map((_, i) => (
        <Box key={i} sx={{ borderBottom: i < itemCount - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
          {variants[variant]}
        </Box>
      ))}
    </List>
  );
}

export function FormSkeleton({ fieldCount = 6, columns = 2 }) {
  const fields = Array.from({ length: fieldCount }).map((_, i) => (
    <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Skeleton variant="text" width="30%" height={16} sx={{ mb: 0.25 }} />
      <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
    </Box>
  ));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Grid container spacing={2.5} columns={columns}>
        {fields.map((field, index) => (
          <Grid item xs={12} sm={columns === 2 ? 6 : 4} key={index}>
            {field}
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
        <Skeleton variant="text" width={80} height={40} variant="rounded" />
        <Skeleton variant="text" width={100} height={40} variant="rounded" />
      </Box>
    </Box>
  );
}

export function DashboardCardSkeleton({ variant = 'kpi', count = 6 }) {
  if (variant === 'kpi') {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: { xs: 1.5, sm: 2 } }}>
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} variant="dashboard" />
        ))}
      </Box>
    );
  }
  
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: { xs: 2, md: 2.5 } }}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} variant="default" />
      ))}
    </Box>
  );
}

export function QuotationPreviewSkeleton({ showLineItems = true, lineItemCount = 4 }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={28} />
          </Box>
          <Box sx={{ textAlign: 'right', minWidth: 150 }}>
            <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="80%" height={14} />
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Skeleton variant="text" width="30%" height={14} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="80%" height={18} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={16} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Skeleton variant="text" width="30%" height={14} sx={{ mb: 0.5, textAlign: 'right' }} />
            <Skeleton variant="text" width="80%" height={18} sx={{ mb: 1, textAlign: 'right' }} />
            <Skeleton variant="text" width="100%" height={16} sx={{ textAlign: 'right' }} />
          </Grid>
        </Grid>
      </Box>
      
      {showLineItems && (
        <Box sx={{ mb: 3 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><Skeleton variant="text" width="60%" height={14} /></TableCell>
                  <TableCell align="center"><Skeleton variant="text" width="40%" height={14} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: lineItemCount }).map((_, i) => (
                  <TableRow key={i} hover>
                    <TableCell><Skeleton variant="text" width="70%" height={16} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width="40%" height={14} /></TableCell>
                    <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                    <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                    <TableCell align="right"><Skeleton variant="text" width="60%" height={16} sx={{ fontWeight: 600 }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ width: 200, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width="50%" height={14} />
              <Skeleton variant="text" width="60%" height={14} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width="50%" height={14} />
              <Skeleton variant="text" width="60%" height={14} />
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width="50%" height={18} sx={{ fontWeight: 600 }} />
              <Skeleton variant="text" width="60%" height={18} sx={{ fontWeight: 600 }} />
            </Box>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Skeleton variant="text" width={80} height={40} variant="rounded" />
        <Skeleton variant="text" width={120} height={40} variant="rounded" />
      </Box>
    </Paper>
  );
}

export function QuotationFormSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2, mb: 2 }} />
              <Skeleton variant="text" width="30%" height={14} sx={{ mb: 0.5 }} />
              <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
            </Box>
            <Box sx={{ minWidth: 150 }}>
              <Skeleton variant="text" width="80%" height={16} sx={{ mb: 1, textAlign: 'right' }} />
              <Skeleton variant="rounded" width={120} height={36} />
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Skeleton variant="text" width="30%" height={16} sx={{ mb: 2 }} />
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><Skeleton variant="text" width="60%" height={14} /></TableCell>
                  <TableCell align="center"><Skeleton variant="text" width="40%" height={14} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                  <TableCell align="center"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} hover>
                    <TableCell><Skeleton variant="text" width="70%" height={16} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width="40%" height={14} /></TableCell>
                    <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                    <TableCell align="right"><Skeleton variant="text" width="50%" height={14} /></TableCell>
                    <TableCell align="right"><Skeleton variant="text" width="60%" height={16} sx={{ fontWeight: 600 }} /></TableCell>
                    <TableCell align="center"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Box sx={{ flex: 1 }} />
              <Box sx={{ width: 200, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="50%" height={14} />
                  <Skeleton variant="text" width="60%" height={14} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="50%" height={14} />
                  <Skeleton variant="text" width="60%" height={14} />
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="50%" height={18} sx={{ fontWeight: 600 }} />
                  <Skeleton variant="text" width="60%" height={18} sx={{ fontWeight: 600 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width="30%" height={16} sx={{ mb: 2 }} />
          <FormSkeleton fieldCount={4} columns={2} />
        </CardContent>
      </Card>
    </Box>
  );
}

export function PageSkeleton({ showHeader = true, headerTitle = 'Page Title', contentVariant = 'cards', contentCount = 6 }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {showHeader && (
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Skeleton variant="text" width={headerTitle.length * 12} height={36} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
            <Skeleton variant="rounded" width={140} height={44} />
          </Box>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <Skeleton variant="rectangular" width={300} height={48} sx={{ borderRadius: 2 }} />
        <Skeleton variant="circular" width={140} height={44} />
        <Skeleton variant="circular" width={140} height={44} />
        <Skeleton variant="circular" width={140} height={44} />
        <Box sx={{ ml: 'auto', display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Skeleton variant="circular" width={36} height={36} />
          <Skeleton variant="circular" width={36} height={36} />
        </Box>
      </Box>
      
      {contentVariant === 'table' ? (
        <Card sx={{ overflow: 'hidden' }}>
          <TableSkeleton columns={7} rows={5} />
        </Card>
      ) : contentVariant === 'list' ? (
        <Card>
          <ListSkeleton itemCount={8} variant="default" />
        </Card>
      ) : (
        <CardSkeleton variant="default" count={contentCount} />
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
        <Skeleton variant="rounded" width={100} height={36} />
        <Skeleton variant="rounded" width={100} height={36} />
        <Skeleton variant="rounded" width={100} height={36} />
        <Skeleton variant="rounded" width={100} height={36} />
        <Skeleton variant="rounded" width={100} height={36} />
      </Box>
    </Box>
  );
}

export function ChartSkeleton({ height = 300 }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: { xs: '16px !important', sm: '20px !important', md: '24px !important' }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="rounded" width={100} height={28} />
        </Box>
        <Box sx={{ flex: 1, height, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#FAFAFA', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, maxWidth: 200, textAlign: 'center' }}>
            <Skeleton variant="circular" width={48} height={48} sx={{ borderRadius: 2, bgcolor: 'primary.main' }} />
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton variant="text" width="80%" height={14} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function AccordionSkeleton({ itemCount = 3 }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Array.from({ length: itemCount }).map((_, i) => (
        <Accordion key={i} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary sx={{ px: 2, py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="50%" height={18} sx={{ mb: 0.25 }} />
                <Skeleton variant="text" width="30%" height={14} />
              </Box>
              <Skeleton variant="rounded" width={80} height={24} />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 3, pb: 2 }}>
            <FormSkeleton fieldCount={4} columns={2} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export function TabsSkeleton({ tabCount = 3, contentVariant = 'cards', contentCount = 4 }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', gap: 0.5, borderBottom: 1, borderColor: 'divider', pb: 0.5 }}>
        {Array.from({ length: tabCount }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={100} height={40} />
        ))}
      </Box>
      {contentVariant === 'table' ? (
        <Card sx={{ overflow: 'hidden' }}>
          <TableSkeleton columns={7} rows={5} />
        </Card>
      ) : (
        <CardSkeleton variant="default" count={contentCount} />
      )}
    </Box>
  );
}

export function LinearProgressSkeleton({ steps = 4, currentStep = 1 }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {Array.from({ length: steps }).map((_, i) => (
          <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#fff',
                bgcolor: i < currentStep ? 'primary.main' : i === currentStep ? 'primary.main' : 'grey.300',
                border: i === currentStep ? '3px solid' : 'none',
                borderColor: 'primary.light',
                zIndex: 1,
              }}
            >
              {i + 1}
            </Box>
            <Skeleton variant="text" width={80} height={14} sx={{ textAlign: 'center' }} />
          </Box>
        ))}
      </Box>
      <Box sx={{ position: 'relative', top: -16, height: 4, mt: -16, mb: 16 }}>
        <LinearProgress
          variant="determinate"
          value={(currentStep - 1) / (steps - 1) * 100}
          sx={{
            height: 4,
            borderRadius: 2,
            '& .MuiLinearProgress-bar': { borderRadius: 2 },
            '& .MuiLinearProgress-barColorPrimary': { background: 'linear-gradient(90deg, #1F6B47, #68AE8E)' },
          }}
        />
      </Box>
    </Box>
  );
}

export function ModalSkeleton({ size = 'md', showHeader = true, showFooter = true }) {
  const widthMap = { xs: 400, sm: 500, md: 600, lg: 800, xl: 1000 };
  
  return (
    <Box
      sx={{
        width: widthMap[size],
        maxWidth: 'calc(100% - 32px)',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {showHeader && (
        <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="60%" height={14} />
          </Box>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      )}
      <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
        <FormSkeleton fieldCount={5} columns={2} />
      </Box>
      {showFooter && (
        <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'flex-end', gap: 1.5, borderTop: 1, borderColor: 'divider' }}>
          <Skeleton variant="text" width={80} height={40} variant="rounded" />
          <Skeleton variant="text" width={100} height={40} variant="rounded" />
        </Box>
      )}
    </Box>
  );
}

export function DataGridSkeleton({ rowCount = 10, columnCount = 8, showToolbar = true, showPagination = true }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {showToolbar && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
<Skeleton variant="rect" width={300} height={48} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" width={140} height={44} />
            <Skeleton variant="rounded" width={140} height={44} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rounded" width={100} height={40} />
            <Skeleton variant="text" width={120} height={40} variant="rounded" />
          </Box>
        </Box>
      )}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {Array.from({ length: columnCount }).map((_, i) => (
                  <TableCell key={i} align={i > 0 ? 'center' : 'left'}>
                    <Skeleton variant="text" width="60%" height={14} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <TableRow key={rowIndex} hover>
                  {Array.from({ length: columnCount }).map((_, colIndex) => (
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

export function SearchResultsSkeleton({ itemCount = 5 }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {Array.from({ length: itemCount }).map((_, i) => (
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
    </Box>
  );
}

export function CalendarSkeleton({ weekCount = 6 }) {
  return (
    <Card>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 2 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Box key={day} sx={{ textAlign: 'center', py: 1 }}>
              <Skeleton variant="text" width="50%" height={14} sx={{ mx: 'auto' }} />
            </Box>
          ))}
        </Box>
        {Array.from({ length: weekCount }).map((_, week) => (
          <Box key={week} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {Array.from({ length: 7 }).map((_, day) => (
              <Box key={day} sx={{ aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
                <Skeleton variant="text" width="40%" height={18} />
              </Box>
            ))}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}