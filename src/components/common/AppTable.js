'use client';

import { useState, useMemo, useCallback } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Box, Typography, useMediaQuery, useTheme, Divider, Skeleton,
  Paper, IconButton, InputBase, Menu, MenuItem, Tooltip, Chip
} from '@mui/material';
import { 
  ChevronLeft, ChevronRight, Search, FilterList, MoreVert, 
  Download, ViewColumn, Refresh, TableRows, GridView 
} from '@mui/icons-material';
import { AppButton } from './AppButton';
import EmptyState from './EmptyState';
import { ErrorState } from './ErrorState';

export function AppTable({
  columns = [],
  data = [],
  loading = false,
  error = null,
  onRetry,
  emptyState,
  onRowClick,
  mobileCardRender,
  sortable = false,
  onSort,
  sortModel,
  filterable = false,
  onFilter,
  filterModel,
  pagination,
  onPaginationChange,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  rowActions,
  striped = true,
  dense = false,
  stickyHeader = false,
  maxHeight,
  showColumnSelector = true,
  showDensitySelector = false,
  showExport = false,
  onExport,
  fullWidth = true,
  ariaLabel = 'Data table',
  sx,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [columnVisibility, setColumnVisibility] = useState(() => 
    columns.reduce((acc, col) => ({ ...acc, [col.field]: col.hide !== true }), {})
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [density, setDensity] = useState(dense ? 'compact' : 'standard');

  const visibleColumns = useMemo(() => 
    columns.filter(col => columnVisibility[col.field] !== false),
    [columns, columnVisibility]
  );

  const handleColumnToggle = (field) => {
    setColumnVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSort = (field) => {
    if (!sortable || !onSort) return;
    const currentSort = sortModel?.[field];
    const newDirection = currentSort === 'asc' ? 'desc' : 'asc';
    onSort({ ...sortModel, [field]: newDirection });
  };

  const renderHeaderCell = (column, index) => {
    const isSortable = sortable && column.sortable !== false;
    const sortDirection = sortModel?.[column.field];
    
    return (
      <TableCell
        key={index}
        align={column.align || 'left'}
        sx={{
          width: column.width,
          whiteSpace: 'nowrap',
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'text.secondary',
          borderBottom: '2px solid',
          borderColor: 'divider',
          py: density === 'compact' ? 1 : 1.5,
          userSelect: 'none',
          cursor: isSortable ? 'pointer' : 'default',
        }}
        onClick={() => isSortable && handleSort(column.field)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: column.align || 'left' }}>
          {column.label}
          {isSortable && (
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 0.5 }}>
              {sortDirection === 'asc' ? (
                <ChevronLeft sx={{ fontSize: 12, color: 'primary.main' }} />
              ) : sortDirection === 'desc' ? (
                <ChevronRight sx={{ fontSize: 12, color: 'primary.main' }} />
              ) : (
                <>
                  <ChevronLeft sx={{ fontSize: 12, color: 'text.disabled', opacity: 0.5 }} />
                  <ChevronRight sx={{ fontSize: 12, color: 'text.disabled', opacity: 0.5 }} />
                </>
              )}
            </Box>
          )}
        </Box>
      </TableCell>
    );
  };

  const renderCell = (column, row, rowIndex) => {
    if (column.render) {
      return column.render(row, rowIndex);
    }
    const value = row[column.field];
    if (column.format) {
      return column.format(value, row);
    }
    return value ?? '—';
  };

  const renderMobileCard = (row, rowIndex) => {
    if (mobileCardRender) {
      return mobileCardRender(row, rowIndex);
    }

    const primaryColumn = visibleColumns[0];
    const secondaryColumns = visibleColumns.slice(1, 4);
    const actionColumn = visibleColumns.find(c => c.field === 'actions' || c.label === '');

    return (
      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: 1.5,
          cursor: onRowClick ? 'pointer' : 'default',
          transition: 'background-color 0.15s ease',
          '&:hover': { bgcolor: '#f8fafc' },
        }}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        role={onRowClick ? 'button' : undefined}
        tabIndex={onRowClick ? 0 : undefined}
        onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(row); }} : undefined}
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
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        {isMobile ? (
          <ListSkeleton count={5} />
        ) : (
          <TableLoader columns={visibleColumns.length} rows={pagination?.rowsPerPage || 10} />
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <ErrorState
          error={error}
          onRetry={onRetry}
          variant="card"
          size="md"
        />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        {emptyState || (
          <EmptyState
            type="general"
            variant={isMobile ? 'inline' : 'card'}
            size="md"
          />
        )}
      </Box>
    );
  }

  const tableContent = (
    <>
      <TableHead sx={{ position: stickyHeader ? 'sticky' : 'static', top: 0, zIndex: 1, bgcolor: 'background.paper' }}>
        <TableRow>
          {selectable && (
            <TableCell
              sx={{ width: 48, py: density === 'compact' ? 1 : 1.5 }}
              padding="checkbox"
            >
              <Checkbox
                indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                checked={selectedRows.length === data.length && data.length > 0}
                onChange={(e) => {
                  if (selectedRows.length === data.length) {
                    onSelectionChange?.([]);
                  } else {
                    onSelectionChange?.(data.map(r => r.id));
                  }
                }}
                size="small"
              />
            </TableCell>
          )}
          {visibleColumns.map(renderHeaderCell)}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow
            key={row.id || rowIndex}
            hover
            selected={selectedRows.includes(row.id)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            sx={{
              cursor: onRowClick ? 'pointer' : 'default',
              '&:last-child td': { borderBottom: 'none' },
              transition: 'background-color 0.15s ease',
            }}
            style={{
              backgroundColor: selectedRows.includes(row.id) 
                ? `${theme.palette.primary.light}20` 
                : rowIndex % 2 === 0 && striped 
                  ? 'rgba(0,0,0,0.02)' 
                  : 'transparent',
            }}
          >
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRows.includes(row.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    const newSelection = selectedRows.includes(row.id)
                      ? selectedRows.filter(id => id !== row.id)
                      : [...selectedRows, row.id];
                    onSelectionChange?.(newSelection);
                  }}
                  size="small"
                />
              </TableCell>
            )}
            {visibleColumns.map((col, colIndex) => (
              <TableCell
                key={colIndex}
                align={col.align || 'left'}
                sx={{ 
                  whiteSpace: 'nowrap',
                  py: density === 'compact' ? 1 : 1.25,
                  fontSize: density === 'compact' ? '0.8125rem' : '0.875rem',
                }}
              >
                {renderCell(col, row, rowIndex)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </>
  );

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {filterable && filterModel && (
        <TableToolbar
          columns={visibleColumns}
          onFilter={onFilter}
          filterModel={filterModel}
          onExport={onExport}
          showExport={showExport}
          onRefresh={onRetry}
          loading={loading}
          density={density}
          onDensityChange={setDensity}
          showDensitySelector={showDensitySelector}
          showColumnSelector={showColumnSelector}
          columnVisibility={columnVisibility}
          onColumnToggle={handleColumnToggle}
          allColumns={columns}
        />
      )}

      {isMobile ? (
        <Box sx={{ p: 0 }}>
          {data.map((row, rowIndex) => (
            <Box key={row.id || rowIndex}>
              {renderMobileCard(row, rowIndex)}
              {rowIndex < data.length - 1 && <Divider sx={{ mx: { xs: 2, sm: 2.5 } }} />}
            </Box>
          ))}
        </Box>
      ) : (
        <TableContainer 
          sx={{ 
            maxHeight: maxHeight,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Table
            size={density === 'compact' ? 'small' : 'medium'}
            aria-label={ariaLabel}
            stickyHeader={stickyHeader}
          >
            {tableContent}
          </Table>
        </TableContainer>
      )}

      {pagination && (
        <TablePagination
          {...pagination}
          onChange={onPaginationChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
          sx={{ mt: 2, px: 1 }}
        />
      )}
    </Box>
  );
}

function TableLoader({ columns = 7, rows = 10 }) {
  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableCell key={i} align={i > 0 ? 'center' : 'left'}>
                <Skeleton variant="text" width="60%" height={16} />
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
  );
}

function TableToolbar({
  columns,
  onFilter,
  filterModel,
  onExport,
  showExport,
  onRefresh,
  loading,
  density,
  onDensityChange,
  showDensitySelector,
  showColumnSelector,
  columnVisibility,
  onColumnToggle,
  allColumns,
}) {
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [columnAnchor, setColumnAnchor] = useState(null);

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: '#FAFAFA',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1, minWidth: 280 }}>
        <InputBase
          placeholder="Search..."
          value={filterModel?.search || ''}
          onChange={(e) => onFilter?.({ ...filterModel, search: e.target.value })}
          sx={{ 
            width: 300, 
            height: 40, 
            '& .MuiInputBase-input': { padding: '8px 12px' },
            '& .MuiInputBase-root': { borderRadius: 2 },
          }}
          startAdornment={<Search sx={{ color: 'text.secondary', mr: 1 }} />}
        />

        {columns.filter(c => c.filterable).map((col, idx) => (
          <Tooltip key={idx} title={`Filter by ${col.label}`}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel shrink>{col.label}</InputLabel>
              <Select
                value={filterModel?.[col.field] || ''}
                onChange={(e) => onFilter?.({ ...filterModel, [col.field]: e.target.value })}
                displayEmpty
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All</MenuItem>
                {col.filterOptions?.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {showDensitySelector && (
          <Tooltip title="Row density">
            <IconButton
              size="small"
              onClick={() => onDensityChange(density === 'compact' ? 'standard' : 'compact')}
              sx={{ color: density === 'compact' ? 'primary.main' : 'text.secondary' }}
            >
              {density === 'compact' ? <GridView fontSize="small" /> : <TableRows fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}

        {showColumnSelector && allColumns.length > 3 && (
          <Tooltip title="Columns">
            <IconButton
              size="small"
              onClick={(e) => setColumnAnchor(e.currentTarget)}
              sx={{ color: 'text.secondary' }}
            >
              <ViewColumn fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {showExport && onExport && (
          <Tooltip title="Export data">
            <IconButton
              size="small"
              onClick={onExport}
              disabled={loading}
              sx={{ color: 'text.secondary' }}
            >
              <Download fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {onRefresh && (
          <Tooltip title="Refresh">
            <IconButton
              size="small"
              onClick={onRefresh}
              disabled={loading}
              sx={{ color: 'text.secondary' }}
            >
              <Refresh fontSize="small" sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {columnAnchor && (
        <Menu
          anchorEl={columnAnchor}
          open={Boolean(columnAnchor)}
          onClose={() => setColumnAnchor(null)}
          PaperProps={{ sx: { maxHeight: 300, mt: 1 } }}
        >
          {allColumns.map((col) => (
            <MenuItem key={col.field} onClick={(e) => { e.stopPropagation(); onColumnToggle(col.field); }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Checkbox
                  checked={columnVisibility[col.field] !== false}
                  size="small"
                />
                <Typography variant="body2">{col.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      )}
    </Box>
  );
}

function TablePagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  sx,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1.5,
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange?.(e)}
            displayEmpty
            sx={{ borderRadius: 2 }}
          >
            {rowsPerPageOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {count > 0 
            ? `${Math.min(page * rowsPerPage + 1, count)}–${Math.min((page + 1) * rowsPerPage, count)} of ${count}`
            : '0–0 of 0'}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onPageChange?.(page - 1)}
          disabled={page === 0}
          sx={{ color: page === 0 ? 'text.disabled' : 'text.secondary' }}
        >
          <ChevronLeft fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onPageChange?.(page + 1)}
          disabled={(page + 1) * rowsPerPage >= count}
          sx={{ color: (page + 1) * rowsPerPage >= count ? 'text.disabled' : 'text.secondary' }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

function SkeletonLoader({ variant = 'list', count = 5 }) {
  const variants = {
    list: () => (
      <Box sx={{ px: 0 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ borderBottom: i < count - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1.5, py: 1.5, alignItems: 'center' }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={18} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="40%" height={14} />
              </Box>
              <Skeleton variant="circular" width={36} height={36} />
            </Box>
          </Box>
        ))}
      </Box>
    ),
    card: () => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 2, cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Skeleton variant="text" width="80%" height={22} sx={{ mb: 0.5 }} />
              <Skeleton variant="rounded" width={60} height={24} />
            </Box>
            <Skeleton variant="text" width="40%" height={14} sx={{ mb: 1, alignSelf: 'flex-start' }} />
            <Skeleton variant="rounded" width={80} height={24} sx={{ alignSelf: 'flex-start', mb: 1 }} />
            <Skeleton variant="text" width="60%" height={14} sx={{ mb: 'auto' }} />
            <Box sx={{ mt: 'auto', pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton variant="text" width={100} height={24} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    ),
  };

  return variants[variant] ? variants[variant]() : variants.list();
}

export default AppTable;