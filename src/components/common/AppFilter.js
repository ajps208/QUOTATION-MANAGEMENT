'use client';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function AppFilter({ label, value, onChange, options = [], sx = {}, ...props }) {
  return (
    <FormControl size="small" sx={{ minWidth: 120, maxWidth: { sm: 180 }, ...sx }} {...props}>
      <InputLabel sx={{ fontSize: '0.8125rem', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>
        {label}
      </InputLabel>
      <Select
        value={value}
        label={label}
        onChange={onChange}
        sx={{ fontSize: '0.875rem', borderRadius: 2.5 }}
      >
        <MenuItem value="">
          <em style={{ color: '#A2A8A4', fontSize: '0.875rem' }}>All</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
