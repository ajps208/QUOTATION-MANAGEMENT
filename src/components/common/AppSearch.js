'use client';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function AppSearch({ value, onChange, placeholder = 'Search...', sx = {}, ...props }) {
  return (
    <TextField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
      size="small"
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 20, color: '#A2A8A4' }} />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        maxWidth: { sm: 320 },
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#ffffff',
          borderRadius: 3,
          minHeight: 40,
          '& fieldset': {
            borderColor: '#E0E0E0',
          },
          '&:hover fieldset': {
            borderColor: '#A2A8A4',
          },
          '& input': {
            fontSize: '0.875rem',
            py: '9px',
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
}
