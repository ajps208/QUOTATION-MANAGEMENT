'use client';
import { useState, useRef } from 'react';
import {
  Box, Typography, Stack, IconButton, Tooltip, TextField, Alert,
  Switch, FormControlLabel, Chip, Button, Divider, Select,
  MenuItem, FormControl, InputLabel, Fade,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DrawIcon from '@mui/icons-material/Draw';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { processImageUpload, generateSignatureId, ACCEPTED_IMAGE_TYPES, MAX_SIZE } from '@/utils/fileUpload';

const SIGNATURE_TYPES = [
  { value: 'company_seal', label: 'Company Seal' },
  { value: 'authorized_signatory', label: 'Authorized Signatory' },
  { value: 'operator_signature', label: 'Operator Signature' },
  { value: 'manager_signature', label: 'Manager Signature' },
  { value: 'accountant_signature', label: 'Accountant Signature' },
  { value: 'hr_signature', label: 'HR Signature' },
  { value: 'director_signature', label: 'Director Signature' },
  { value: 'custom', label: 'Custom' },
];

export default function BusinessSignatureManager({ signatures = [], onChange }) {
  const [error, setError] = useState('');
  const [newType, setNewType] = useState('custom');
  const [newDisplayName, setNewDisplayName] = useState('');
  const fileInputRefs = useRef({});

  const handleFile = async (sigId, file) => {
    setError('');
    if (!file) return;
    const result = await processImageUpload(file, { type: 'signature' });
    if (result.success) {
      onChange(signatures.map((s) => (s._id === sigId ? { ...s, image: result.dataUrl } : s)));
    } else {
      setError(result.error);
    }
    if (fileInputRefs.current[sigId]) fileInputRefs.current[sigId].value = '';
  };

  const handleAdd = () => {
    const typeExists = signatures.some(s => s.type === newType && s.isActive);
    if (typeExists && newType !== 'custom') {
      setError(`A ${SIGNATURE_TYPES.find(t => t.value === newType)?.label} already exists.`);
      return;
    }
    const displayName = newDisplayName.trim() || SIGNATURE_TYPES.find(t => t.value === newType)?.label || 'Signature';
    onChange([
      ...signatures,
      {
        _id: generateSignatureId(),
        type: newType,
        displayName,
        image: null,
        uploadedBy: '',
        uploadedAt: new Date().toISOString(),
        isDefault: false,
        isActive: true,
        order: signatures.length,
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
    onChange(signatures.map((s) => ({
      ...s,
      isDefault: s._id === sigId ? !s.isDefault : false,
    })));
  };

  const handleMove = (sigId, direction) => {
    const idx = signatures.findIndex(s => s._id === sigId);
    if (idx === -1) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= signatures.length) return;
    const newSigs = [...signatures];
    [newSigs[idx], newSigs[newIdx]] = [newSigs[newIdx], newSigs[idx]];
    onChange(newSigs.map((s, i) => ({ ...s, order: i })));
  };

  const handleDisplayNameChange = (sigId, displayName) => {
    onChange(signatures.map((s) => (s._id === sigId ? { ...s, displayName } : s)));
  };

  const handleTypeChange = (sigId, type) => {
    onChange(signatures.map((s) => (s._id === sigId ? { ...s, type } : s)));
  };

  const availableTypes = SIGNATURE_TYPES.filter(
    t => t.value === 'custom' || !signatures.some(s => s.type === t.value && s.isActive)
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
            Add signatures that will be available when creating quotations.
          </Typography>
        </Box>
      )}

      <Stack spacing={2}>
        {signatures.map((sig, idx) => (
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
              <Box
                sx={{
                  width: { xs: '100%', sm: 180 },
                  height: 100,
                  border: '2px dashed',
                  borderColor: sig.image ? 'transparent' : '#CBD5E1',
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
                {sig.image ? (
                  <>
                    <Box
                      component="img"
                      src={sig.image}
                      alt={sig.displayName}
                      sx={{ maxHeight: 92, maxWidth: '100%', objectFit: 'contain', p: 0.5 }}
                    />
                    <Tooltip title="Replace image">
                      <IconButton
                        size="small"
                        component="label"
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
                      >
                        <UploadFileIcon fontSize="small" />
                        <input
                          ref={el => fileInputRefs.current[sig._id] = el}
                          hidden
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(',')}
                          onChange={(e) => handleFile(sig._id, e.target.files?.[0])}
                        />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Button
                    component="label"
                    size="small"
                    startIcon={<UploadFileIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Upload
                    <input
                      ref={el => fileInputRefs.current[sig._id] = el}
                      hidden
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(',')}
                      onChange={(e) => handleFile(sig._id, e.target.files?.[0])}
                    />
                  </Button>
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                  {sig.isDefault && (
                    <Chip icon={<StarIcon sx={{ fontSize: 14 }} />} label="Default" size="small" color="warning" variant="filled" sx={{ height: 22, fontSize: '0.6875rem' }} />
                  )}
                  <Chip label={sig.isActive ? 'Active' : 'Disabled'} size="small" color={sig.isActive ? 'success' : 'default'} variant="outlined" sx={{ height: 22, fontSize: '0.6875rem' }} />
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

              <Stack direction="row" spacing={0.5} sx={{ alignSelf: { xs: 'flex-end', sm: 'center' }, flexShrink: 0 }}>
                <Tooltip title="Move up">
                  <IconButton size="small" onClick={() => handleMove(sig._id, 'up')} disabled={idx === 0}>
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Move down">
                  <IconButton size="small" onClick={() => handleMove(sig._id, 'down')} disabled={idx === signatures.length - 1}>
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={sig.isActive ? 'Disable' : 'Enable'}>
                  <IconButton size="small" onClick={() => handleToggleActive(sig._id)} color={sig.isActive ? 'success' : 'default'}>
                    {sig.isActive ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={sig.isDefault ? 'Remove default' : 'Set as default'}>
                  <IconButton size="small" onClick={() => handleToggleDefault(sig._id)} color={sig.isDefault ? 'warning' : 'default'}>
                    {sig.isDefault ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove">
                  <IconButton size="small" onClick={() => handleRemove(sig._id)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 2.5 }} />

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Signature Type</InputLabel>
          <Select value={newType} label="Signature Type" onChange={(e) => setNewType(e.target.value)}>
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
        <Tooltip title="Add new signature">
          <IconButton
            onClick={handleAdd}
            color="primary"
            sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: 1.5, px: 1.5 }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
