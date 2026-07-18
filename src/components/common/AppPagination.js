import { TablePagination } from '@mui/material';
import { DEFAULTS } from '@/constants/defaults';

export default function AppPagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = DEFAULTS.PAGINATION.PAGE_SIZE_OPTIONS,
  ...props
}) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={rowsPerPageOptions}
      sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.8125rem' } }}
      {...props}
    />
  );
}
