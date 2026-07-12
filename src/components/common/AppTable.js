import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function AppTable({ columns = [], data = [], emptyState, ...props }) {
  if (!data || data.length === 0) {
    return emptyState || null;
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="data table" {...props}>
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell key={index} align={col.align || 'left'} sx={{ width: col.width }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row.id || rowIndex}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { bgcolor: '#f8fafc' },
                transition: 'background-color 0.15s ease',
              }}
            >
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex} align={col.align || 'left'}>
                  {col.render ? col.render(row) : row[col.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
