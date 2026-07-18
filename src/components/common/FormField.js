import { forwardRef } from 'react';
import { TextField, MenuItem, Typography, Box } from '@mui/material';

const FormField = forwardRef(function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder,
  autoFocus = false,
  multiline = false,
  rows,
  fullWidth = true,
  size = 'medium',
  select = false,
  options = [],
  children,
  startAdornment,
  endAdornment,
  inputLabelProps,
  inputProps,
  slotProps = {},
  sx = {},
  ...props
}, ref) {
  const adornments = {};
  if (startAdornment) {
    adornments.startAdornment = startAdornment;
  }
  if (endAdornment) {
    adornments.endAdornment = endAdornment;
  }

  const mergedSlotProps = {
    ...slotProps,
    input: {
      ...slotProps.input,
      ...inputProps,
      ...(Object.keys(adornments).length > 0 && { startAdornment: adornments.startAdornment, endAdornment: adornments.endAdornment }),
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
      {select ? (
        <TextField
          ref={ref}
          select
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          required={required}
          disabled={disabled}
          fullWidth={fullWidth}
          size={size}
          placeholder={placeholder}
          sx={{
            ...sx,
            '& .MuiInputLabel-root': {
              whiteSpace: 'normal',
              overflow: 'visible',
              textOverflow: 'clip',
            },
          }}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
          {children}
        </TextField>
      ) : (
        <TextField
          ref={ref}
          type={type}
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus={autoFocus}
          multiline={multiline}
          rows={rows}
          fullWidth={fullWidth}
          size={size}
          slotProps={mergedSlotProps}
          sx={{
            ...sx,
            '& .MuiInputLabel-root': {
              whiteSpace: 'normal',
              overflow: 'visible',
              textOverflow: 'clip',
            },
          }}
          {...props}
        />
      )}
    </Box>
  );
});

export default FormField;
