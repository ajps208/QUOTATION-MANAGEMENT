'use client';
import { useState, useRef } from 'react';
import {
  Box, Typography, Avatar, IconButton, TextField, Stack, Chip,
  InputAdornment, Tooltip, Button, Fade, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DrawIcon from '@mui/icons-material/Draw';
import RestoreIcon from '@mui/icons-material/Restore';

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ACCEPTED = 'image/png,image/jpeg,image/webp';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

let uidCounter = 0;
function makeId() {
  uidCounter += 1;
  return `sig_${Date.now().toString(36)}_${uidCounter}`;
}

/**
 * SignatureUploader — manage a list of named signature images.
 *
 * Props:
 *   signatures   — array of { id, label, type, dataUrl }
 *   onChange     — (next: signatures[]) => void
 *   defaults     — optional array of default signatures to restore to (business defaults)
 *   readOnly     — disable editing
 */
export default function SignatureUploader({ signatures = [], onChange, defaults = null, readOnly = false }) {
  const [error, setError] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const fileInputRefs = useRef({});

  const handleFile = async (id, file) => {
    setError('');
    if (!file) return;
    if (!ACCEPTED.split(',').includes(file.type)) {
      setError('Only PNG, JPEG, or WebP images are allowed.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Image must be smaller than 2MB.');
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(signatures.map((s) => (s.id === id ? { ...s, dataUrl } : s)));
    } catch (err) {
      setError('Could not read the selected image.');
    }
  };

  const handleAdd = () => {
    const label = newLabel.trim() || `Signature ${signatures.length + 1}`;
    onChange([...signatures, { id: makeId(), label, type: 'signature', dataUrl: '' }]);
    setNewLabel('');
  };

  const handleRemove = (id) => {
    onChange(signatures.filter((s) => s.id !== id));
  };

  const handleLabelChange = (id, label) => {
    onChange(signatures.map((s) => (s.id === id ? { ...s, label } : s)));
  };

  const handleRestoreDefaults = () => {
    if (defaults) onChange(defaults.map((s) => ({ ...s })));
  };

  if (readOnly) {
    return (
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {signatures.length === 0 && (
          <Typography variant="body2" color="text.secondary">No signatures added.</Typography>
        )}
        {signatures.map((s) => (
          <Box key={s.id} sx={{ textAlign: 'center' }}>
            {s.dataUrl ? (
              <Box
                component="img"
                src={s.dataUrl}
                alt={s.label}
                sx={{ height: 64, maxWidth: 180, objectFit: 'contain', borderBottom: '1px solid #94a3b8', p: 0.5 }}
              />
            ) : (
              <Box sx={{ height: 64, width: 160, borderBottom: '1px solid #94a3b8' }} />
            )}
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              {s.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8125rem' }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {signatures.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#F8FAFC', borderRadius: 2, border: '1px dashed', borderColor: '#E2E8F0' }}>
          <DrawIcon sx={{ color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No signatures yet. Add the signatures required for your quotations below.
          </Typography>
        </Box>
      )}

      <Stack spacing={2}>
        {signatures.map((sig) => (
          <Box
            key={sig.id}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}>
              <TextField
                label="Label"
                value={sig.label}
                onChange={(e) => handleLabelChange(sig.id, e.target.value)}
                size="small"
                sx={{ minWidth: { sm: 200 }, flex: { sm: 1 } }}
                placeholder="e.g. Authorized Signatory"
              />
              <Box
                sx={{
                  width: { xs: '100%', sm: 180 },
                  height: 80,
                  border: '1px dashed',
                  borderColor: sig.dataUrl ? 'transparent' : '#CBD5E1',
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#F8FAFC',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {sig.dataUrl ? (
                  <>
                    <Box
                      component="img"
                      src={sig.dataUrl}
                      alt={sig.label}
                      sx={{ maxHeight: 72, maxWidth: '100%', objectFit: 'contain' }}
                    />
                    <Tooltip title="Replace image">
                      <IconButton
                        size="small"
                        component="label"
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper' }}
                      >
                        <UploadFileIcon fontSize="small" />
                        <input
                          hidden
                          type="file"
                          accept={ACCEPTED}
                          onChange={(e) => handleFile(sig.id, e.target.files?.[0])}
                        />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Button component="label" size="small" startIcon={<UploadFileIcon />} sx={{ textTransform: 'none' }}>
                    Upload Image
                    <input
                      hidden
                      type="file"
                      accept={ACCEPTED}
                      onChange={(e) => handleFile(sig.id, e.target.files?.[0])}
                    />
                  </Button>
                )}
              </Box>
              <Tooltip title="Remove signature">
                <IconButton onClick={() => handleRemove(sig.id)} color="error" sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1, flex: 1, minWidth: 200 }}>
          <TextField
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
            size="small"
            placeholder="New signature label (optional)"
            sx={{ flex: 1 }}
          />
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAdd} sx={{ textTransform: 'none' }}>
            Add
          </Button>
        </Box>
        {defaults && (
          <Tooltip title="Restore to business default signatures">
            <Button variant="text" startIcon={<RestoreIcon />} onClick={handleRestoreDefaults} sx={{ textTransform: 'none' }}>
              Use Defaults
            </Button>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
