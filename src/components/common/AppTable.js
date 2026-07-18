'use client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, useMediaQuery, useTheme, Divider } from '@mui/material';

export default function AppTable({ columns = [], data = [], emptyState, onRowClick, mobileCardRender }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!data || data.length === 0) {
    return emptyState || null;
  }

  // Mobile card view (custom)
  if (isMobile && mobileCardRender) {
    return (
      <Box sx={{ p: 0 }}>
        {data.map((row, rowIndex) => (
          <Box key={row.id || rowIndex}>
            {mobileCardRender(row, rowIndex)}
            {rowIndex < data.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>
    );
  }

  // Mobile/tablet compact card view
  if (isMobile) {
    const primaryColumn = columns[0];
    const secondaryColumns = columns.filter((_, i) => i > 0 && !columns[i]?.hideOnMobile).slice(0, 2);
    const actionColumn = columns.find(c => c.field === 'actions' || c.label === '');

    return (
      <Box sx={{ p: 0 }}>
        {data.map((row, rowIndex) => (
          <Box
            key={row.id || rowIndex}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            sx={{
              px: { xs: 2, sm: 2.5 },
              py: 1.5,
              cursor: onRowClick ? 'pointer' : 'default',
              transition: 'background-color 0.15s ease',
              '&:hover': { bgcolor: '#f8fafc' },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, gap: 1 }}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
                  {primaryColumn?.render ? primaryColumn.render(row) : row[primaryColumn?.field]}
                </Typography>
              </Box>
              {actionColumn?.render && (
                <Box sx={{ flexShrink: 0 }}>
                  {actionColumn.render(row)}
                </Box>
              )}
            </Box>
            {secondaryColumns.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', mt: 0.5 }}>
                {secondaryColumns.map((col, idx) => (
                  <Typography key={idx} variant="caption" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                    {col.render ? col.render(row) : row[col.field]}
                  </Typography>
                ))}
              </Box>
            )}
            {rowIndex < data.length - 1 && <Divider sx={{ mt: 1 }} />}
          </Box>
        ))}
      </Box>
    );
  }

  // Desktop table view
  return (
    <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <Table sx={{ minWidth: { sm: 500 } }} size="small" aria-label="data table">
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell
                key={index}
                align={col.align || 'left'}
                sx={{
                  width: col.width,
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row.id || rowIndex}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              hover
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
              }}
            >
              {columns.map((col, colIndex) => (
                <TableCell
                  key={colIndex}
                  align={col.align || 'left'}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {col.render ? col.render(row) : row[col.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
