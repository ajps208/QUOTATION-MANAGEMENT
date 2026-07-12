import { useState, useMemo } from 'react';
import { DEFAULTS } from '@/constants/defaults';

export function usePagination(initialData = [], initialPageSize = DEFAULTS.PAGINATION.PAGE_SIZE) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(0); // 0-indexed for MUI
  const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [data, page, rowsPerPage]);

  return {
    data,
    setData,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    paginatedData,
    totalCount: data.length,
    setPage,
  };
}
