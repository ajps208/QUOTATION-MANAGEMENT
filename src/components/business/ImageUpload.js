'use client';
import { useRef, useState } from 'react';
import {
  Box, Typography, IconButton, Tooltip, CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { processImageUpload, validateImageFile } from '@/utils/fileUpload';

export default function ImageUpload({
  value,
  onChange,
  onDelete,
  type = 'logo',
  accept = 'image/png,image/jpeg,image/webp,image/svg+xml',
  label = 'Upload Image',
  previewSx = {},
  emptySx = {},
  maxSize,
  readOnly = false,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const result = await processImageUpload(file, { type, maxSize });
      if (result.success) {
        onChange(result.dataUrl);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to process file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete();
    else if (onChange) onChange(null);
  };

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          height: type === 'logo' ? 140 : 100,
          border: '2px dashed',
          borderColor: value ? 'transparent' : '#CBD5E1',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: value ? 'transparent' : '#F8FAFC',
          position: 'relative',
          overflow: 'hidden',
          cursor: readOnly ? 'default' : 'pointer',
          transition: 'border-color 0.2s',
          '&:hover': readOnly ? {} : { borderColor: 'primary.light' },
          ...emptySx,
        }}
        onClick={() => !readOnly && fileInputRef.current?.click()}
      >
        {value ? (
          <>
            <Box
              component="img"
              src={value}
              alt={label}
              sx={{
                maxHeight: type === 'logo' ? 120 : 80,
                maxWidth: '100%',
                objectFit: 'contain',
                p: 1,
                ...previewSx,
              }}
            />
            {!readOnly && (
              <Tooltip title="Replace image">
                <IconButton
                  size="small"
                  component="label"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'background.paper',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <UploadFileIcon fontSize="small" />
                  <input
                    ref={fileInputRef}
                    hidden
                    type="file"
                    accept={accept}
                    onChange={handleFileSelect}
                  />
                </IconButton>
              </Tooltip>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 1 }}>
            {uploading ? (
              <CircularProgress size={28} />
            ) : (
              <>
                <UploadFileIcon sx={{ color: 'text.disabled', mb: 0.5, fontSize: 28 }} />
                <Typography variant="caption" color="text.secondary" display="block">
                  {label}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Box>

      {!readOnly && value && onDelete && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Tooltip title="Remove image">
            <IconButton size="small" onClick={handleDelete} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}

      {!readOnly && !value && (
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          hidden
          onChange={handleFileSelect}
        />
      )}
    </Box>
  );
}
