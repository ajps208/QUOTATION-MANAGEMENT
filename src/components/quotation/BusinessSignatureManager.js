'use client';
import { useState, useRef } from 'react';
import {
  Box, Typography, Stack, IconButton, Tooltip, TextField,
  Switch, FormControlLabel, Chip, Fade, Alert, Divider,
  Select, MenuItem, FormControl, InputLabel, Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DrawIcon from '@mui/icons-material/Draw';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const MAX_SIZE_BYTES = 2 * 1024 * 1024;
const ACCEPTED = 'image/png,image/jpeg,image/webp,image/svg+xml';
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

const SIGNATURE_TYPES = [
  { value: 'company_seal', label: 'Company Seal' },
  { value: 'authorized_signatory', label: 'Authorized Signatory' },
  { value: 'operator_signature', label: 'Operator Signature' },
  { value: 'accountant_signature', label: 'Accountant Signature' },
  { value: 'manager_signature', label: 'Manager Signature' },
  { value: 'custom', label: 'Other (Custom)' },
];

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
  return `bsig_${Date.now().toString(36)}_${uidCounter}`;
}

export default function BusinessSignatureManager({ signatures = [], onChange }) {
  const [error, setError] = useState('');
  const [newType, setNewType] = useState('custom');
  const [newDisplayName, setNewDisplayName] = useState('');
  const fileInputRefs = useRef({});

  const handleFile = async (sigId, file) => {
    setError('');
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only PNG, JPEG, WebP, or SVG images are allowed.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Image must be smaller than 2MB.');
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(signatures.map((s) => (s._id === sigId ? { ...s, imageUrl: dataUrl } : s)));
    } catch (err) {
      setError('Could not read the selected image.');
    }
    if (fileInputRefs.current[sigId]) {
      fileInputRefs.current[sigId].value = '';
    }
  };

  const handleAdd = () => {
    const typeExists = signatures.some(s => s.type === newType && s.isActive);
    if (typeExists && newType !== 'custom') {
      setError(`A ${SIGNATURE_TYPES.find(t => t.value === newType)?.label} already exists. Edit or remove it first.`);
      return;
    }
    const displayName = newDisplayName.trim() || SIGNATURE_TYPES.find(t => t.value === newType)?.label || 'Signature';
    onChange([
      ...signatures,
      {
        _id: makeId(),
        type: newType,
        displayName,
        imageUrl: null,
        uploadedBy: null,
        uploadedAt: new Date().toISOString(),
        isDefault: false,
        isActive: true,
      },
    ]);
    setNewDisplayName('');
    setNewType('custom');
  };

  const handleRemove = (sigId) => {
    onChange(signatures.filter((s) => s._id !== sigId));
  };

  const handleToggleActive = (sigId) => {
    onChange(signatures.map((s) => (s._id === sigId ? { ...s, isActive: !s.isActive } : s)));
  };

  const handleToggleDefault = (sigId) => {
    onChange(signatures.map((s) => (s._id === sigId ? { ...s, isDefault: !s.isDefault } : s)));
  };

  const handleDisplayNameChange = (sigId, displayName) => {
    onChange(signatures.map((s) => (s._id === sigId ? { ...s, displayName } : s)));
  };

  const handleTypeChange = (sigId, type) => {
    onChange(signatures.map((s) => (s._id === sigId ? { ...s, type } : s)));
  };

  const availableTypes = SIGNATURE_TYPES.filter(
    t => t.value === 'custom' || !signatures.some(s => s.type === t.value && s._id !== undefined && s.isActive)
  );

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8125rem' }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {signatures.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#F8FAFC', borderRadius: 2, border: '1px dashed', borderColor: '#E2E8F0' }}>
          <DrawIcon sx={{ color: 'text.disabled', mb: 1, fontSize: 40 }} />
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            No business signatures configured
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Add signatures that will be automatically available when creating quotations.
          </Typography>
        </Box>
      )}

      <Stack spacing={2}>
        {signatures.map((sig) => (
          <Box
            key={sig._id}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: sig.isActive ? 'divider' : '#E2E8F0',
              backgroundColor: sig.isActive ? 'background.paper' : '#F8FAFC',
              opacity: sig.isActive ? 1 : 0.65,
              transition: 'all 0.2s',
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}>
              {/* Signature Image Preview / Upload */}
              <Box
                sx={{
                  width: { xs: '100%', sm: 180 },
                  height: 100,
                  border: '2px dashed',
                  borderColor: sig.imageUrl ? 'transparent' : '#CBD5E1',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#F8FAFC',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {sig.imageUrl ? (
                  <>
                    <Box
                      component="img"
                      src={sig.imageUrl}
                      alt={sig.displayName}
                      sx={{ maxHeight: 92, maxWidth: '100%', objectFit: 'contain', p: 0.5 }}
                    />
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
                          hidden
                          type="file"
                          accept={ACCEPTED}
                          onChange={(e) => handleFile(sig._id, e.target.files?.[0])}
                        />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      component="label"
                      size="small"
                      startIcon={<UploadFileIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      Upload Image
                      <input
                        hidden
                        type="file"
                        accept={ACCEPTED}
                        onChange={(e) => handleFile(sig._id, e.target.files?.[0])}
                      />
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Signature Details */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                  {sig.isDefault && (
                    <Chip
                      icon={<StarIcon sx={{ fontSize: 14 }} />}
                      label="Default"
                      size="small"
                      color="warning"
                      variant="filled"
                      sx={{ height: 22, fontSize: '0.6875rem' }}
                    />
                  )}
                  <Chip
                    label={sig.isActive ? 'Active' : 'Disabled'}
                    size="small"
                    color={sig.isActive ? 'success' : 'default'}
                    variant="outlined"
                    sx={{ height: 22, fontSize: '0.6875rem' }}
                  />
                </Stack>

                <TextField
                  label="Display Name"
                  value={sig.displayName}
                  onChange={(e) => handleDisplayNameChange(sig._id, e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="e.g. Authorized Signatory"
                  sx={{ mb: 1.5 }}
                />

                <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                  <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Signature Type</InputLabel>
                  <Select
                    value={sig.type}
                    label="Signature Type"
                    onChange={(e) => handleTypeChange(sig._id, e.target.value)}
                  >
                    {SIGNATURE_TYPES.map((t) => (
                      <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="caption" color="text.secondary">
                  {sig.uploadedAt ? `Uploaded: ${new Date(sig.uploadedAt).toLocaleDateString()}` : 'No image uploaded'}
                </Typography>
              </Box>

              {/* Actions */}
              <Stack direction="row" spacing={0.5} sx={{ alignSelf: { xs: 'flex-end', sm: 'center' }, flexShrink: 0 }}>
                <Tooltip title={sig.isActive ? 'Disable signature' : 'Enable signature'}>
                  <IconButton onClick={() => handleToggleActive(sig._id)} size="small" color={sig.isActive ? 'success' : 'default'}>
                    {sig.isActive ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={sig.isDefault ? 'Remove default' : 'Set as default'}>
                  <IconButton onClick={() => handleToggleDefault(sig._id)} size="small" color={sig.isDefault ? 'warning' : 'default'}>
                    {sig.isDefault ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove signature">
                  <IconButton onClick={() => handleRemove(sig._id)} size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 2.5 }} />

      {/* Add New Signature */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Signature Type</InputLabel>
          <Select
            value={newType}
            label="Signature Type"
            onChange={(e) => setNewType(e.target.value)}
          >
            {availableTypes.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          value={newDisplayName}
          onChange={(e) => setNewDisplayName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          size="small"
          placeholder="Display name (optional)"
          sx={{ flex: 1, minWidth: 200 }}
        />
        <Tooltip title="Add a new signature slot">
          <IconButton
            onClick={handleAdd}
            color="primary"
            sx={{
              border: '1px solid',
              borderColor: 'primary.main',
              borderRadius: 1.5,
              px: 1.5,
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
