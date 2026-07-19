'use client';

import {
  Box, Typography, Drawer, IconButton, Stack, Chip, Button, Divider,
  useMediaQuery, useTheme, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { REQUEST_STATUS } from '@/constants/statuses';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  ...Object.values(REQUEST_STATUS).map(s => ({ value: s, label: s })),
];

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'updatedAt:desc', label: 'Recently Updated' },
  { value: 'updatedAt:asc', label: 'Least Recently Updated' },
  { value: 'status:asc', label: 'Status (A-Z)' },
  { value: 'status:desc', label: 'Status (Z-A)' },
];

function FilterContent({ filters, onFilterChange, onClear, businessOptions, width }) {
  const activeCount = [filters.status, filters.businessId].filter(Boolean).length;

  return (
    <Box sx={{ width, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem' }}>
            Filters
          </Typography>
          {activeCount > 0 && (
            <Chip
              label={activeCount}
              size="small"
              color="primary"
              sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, '& .MuiChip-label': { px: 1 } }}
            />
          )}
        </Box>
        {activeCount > 0 && (
          <Button
            size="small"
            startIcon={<FilterListOffIcon sx={{ fontSize: 16 }} />}
            onClick={onClear}
            sx={{ textTransform: 'none', fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary' }}
          >
            Clear All
          </Button>
        )}
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel shrink>Status</InputLabel>
          <Select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            label="Status"
            displayEmpty
            sx={{ borderRadius: 2 }}
          >
            {STATUS_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {businessOptions.length > 0 && (
          <FormControl fullWidth size="small">
            <InputLabel shrink>Business / Vendor</InputLabel>
            <Select
              value={filters.businessId || ''}
              onChange={(e) => onFilterChange({ ...filters, businessId: e.target.value })}
              label="Business / Vendor"
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Vendors</MenuItem>
              {businessOptions.map(b => (
                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth size="small">
          <InputLabel shrink>Sort By</InputLabel>
          <Select
            value={filters.sortBy || 'createdAt:desc'}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            label="Sort By"
            sx={{ borderRadius: 2 }}
          >
            {SORT_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel shrink>Items per Page</InputLabel>
          <Select
            value={filters.pageSize || 10}
            onChange={(e) => onFilterChange({ ...filters, pageSize: parseInt(e.target.value), page: 0 })}
            label="Items per Page"
            sx={{ borderRadius: 2 }}
          >
            {[10, 25, 50, 100].map(n => (
              <MenuItem key={n} value={n}>{n} items</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider />

      <Box sx={{ px: 3, py: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClear}
          disabled={activeCount === 0 && !filters.sortBy?.includes('createdAt:desc')}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: 'divider',
            color: 'text.secondary',
            '&:hover': { borderColor: 'text.secondary', bgcolor: 'grey.50' },
          }}
        >
          Reset to Defaults
        </Button>
      </Box>
    </Box>
  );
}

export default function RequestFilters({ open, onClose, filters, onFilterChange, onClear, businessOptions = [] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 320,
            maxHeight: isMobile ? '80vh' : '100%',
            borderTopLeftRadius: isMobile ? 18 : 0,
            borderTopRightRadius: isMobile ? 18 : 0,
            borderBottomLeftRadius: isMobile ? 0 : 0,
            borderBottomRightRadius: isMobile ? 0 : 0,
          },
        }}
        slotProps={{
          backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' } },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pt: 1 }}>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <FilterContent
          filters={filters}
          onFilterChange={onFilterChange}
          onClear={onClear}
          businessOptions={businessOptions}
          width="100%"
        />
      </Drawer>
    </>
  );
}

export { SORT_OPTIONS, STATUS_OPTIONS };
