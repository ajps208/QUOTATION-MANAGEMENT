'use client';
import { useState, useRef } from 'react';
import {
  Box, Typography, Stack, IconButton, Tooltip, Chip,
  Button, Fade, Alert, Divider, Switch, FormControlLabel,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DrawIcon from '@mui/icons-material/Draw';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';

const MAX_SIZE_BYTES = 2 * 1024 * 1024;
const ACCEPTED = 'image/png,image/jpeg,image/webp,image/svg+xml';
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

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
  return `qsig_${Date.now().toString(36)}_${uidCounter}`;
}

/**
 * QuotationSignaturePicker — Pick or upload signatures for a quotation.
 *
 * Props:
 *   businessSignatures — array from BusinessSchema.businessSignatures
 *   signatures         — current quotation signatures array [{type, displayName, imageUrl, source}]
 *   onChange           — (nextSignatures[]) => void
 *   settings           — quotation settings for display config
 */
export default function QuotationSignaturePicker({ businessSignatures = [], signatures = [], onChange, settings = {} }) {
  const [error, setError] = useState('');
  const fileInputRefs = useRef({});

  const handleFile = async (sigType, file) => {
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
      const existing = signatures.find(s => s.type === sigType);
      if (existing) {
        onChange(signatures.map(s => s.type === sigType ? { ...s, imageUrl: dataUrl, source: 'manual' } : s));
      } else {
        onChange([...signatures, {
          type: sigType,
          displayName: businessSignatures.find(b => b.type === sigType)?.displayName || sigType,
          imageUrl: dataUrl,
          source: 'manual',
          uploadedAt: new Date().toISOString(),
        }]);
      }
    } catch (err) {
      setError('Could not read the selected image.');
    }
    if (fileInputRefs.current[sigType]) {
      fileInputRefs.current[sigType].value = '';
    }
  };

  const handleUseBusiness = (bizSig) => {
    const existing = signatures.find(s => s.type === bizSig.type);
    if (existing) {
      onChange(signatures.map(s => s.type === bizSig.type ? {
        ...s,
        imageUrl: bizSig.imageUrl,
        displayName: bizSig.displayName,
        source: 'business',
      } : s));
    } else {
      onChange([...signatures, {
        type: bizSig.type,
        displayName: bizSig.displayName,
        imageUrl: bizSig.imageUrl,
        source: 'business',
        uploadedAt: new Date().toISOString(),
      }]);
    }
  };

  const handleRemove = (sigType) => {
    onChange(signatures.filter(s => s.type !== sigType));
  };

  const handleRemoveAll = () => {
    onChange([]);
  };

  const getSigForType = (type) => signatures.find(s => s.type === type);

  const activeBusinessSigs = (businessSignatures || []).filter(s => s.isActive && s.imageUrl);

  const position = settings.defaultSignaturePosition || 'right';

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8125rem' }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {activeBusinessSigs.length === 0 && signatures.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#F8FAFC', borderRadius: 2, border: '1px dashed', borderColor: '#E2E8F0' }}>
          <DrawIcon sx={{ color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No signatures available. Upload signatures in Business Settings first, or upload temporary signatures below.
          </Typography>
        </Box>
      )}

      {/* Business Signatures to choose from */}
      {activeBusinessSigs.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6875rem', display: 'block', mb: 1.5 }}>
            Business Signatures
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            {activeBusinessSigs.map((bizSig) => {
              const isSelected = signatures.some(s => s.type === bizSig.type && s.imageUrl);
              const currentSig = getSigForType(bizSig.type);
              const isLinked = currentSig?.source === 'business' && currentSig?.imageUrl === bizSig.imageUrl;

              return (
                <Box
                  key={bizSig._id}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    bgcolor: isSelected ? 'primary.50' : 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': { borderColor: 'primary.main', bgcolor: '#F8FAFC' },
                    minWidth: 200,
                  }}
                  onClick={() => handleUseBusiness(bizSig)}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#F1F5F9',
                    }}
                  >
                    <Box component="img" src={bizSig.imageUrl} alt={bizSig.displayName} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{bizSig.displayName}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                      {bizSig.type.replace(/_/g, ' ')}
                    </Typography>
                  </Box>
                  {isSelected && (
                    <Chip label="Selected" size="small" color="primary" variant="filled" sx={{ height: 20, fontSize: '0.625rem' }} />
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* Selected Signatures */}
      {signatures.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6875rem' }}>
              Selected for This Quotation
            </Typography>
            {signatures.length > 1 && (
              <Button size="small" color="error" onClick={handleRemoveAll} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
                Remove All
              </Button>
            )}
          </Box>
          <Stack spacing={1.5}>
            {signatures.map((sig) => (
              <Box
                key={sig.type}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#F8FAFC',
                    flexShrink: 0,
                  }}
                >
                  {sig.imageUrl ? (
                    <Box component="img" src={sig.imageUrl} alt={sig.displayName} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <DrawIcon sx={{ color: 'text.disabled' }} />
                  )}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={0.5} sx={{ mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {sig.displayName}
                    </Typography>
                    <Chip
                      icon={sig.source === 'business' ? <LinkIcon sx={{ fontSize: 12 }} /> : <LinkOffIcon sx={{ fontSize: 12 }} />}
                      label={sig.source === 'business' ? 'Business' : 'Temporary'}
                      size="small"
                      variant="outlined"
                      color={sig.source === 'business' ? 'primary' : 'warning'}
                      sx={{ height: 20, fontSize: '0.625rem' }}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    {sig.type.replace(/_/g, ' ')}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Replace with custom upload">
                    <IconButton size="small" component="label">
                      <UploadFileIcon fontSize="small" />
                      <input
                        hidden
                        type="file"
                        accept={ACCEPTED}
                        ref={(el) => { fileInputRefs.current[sig.type] = el; }}
                        onChange={(e) => handleFile(sig.type, e.target.files?.[0])}
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove signature">
                    <IconButton size="small" color="error" onClick={() => handleRemove(sig.type)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Upload Temporary */}
      {activeBusinessSigs.length > 0 && (
        <Box sx={{ mt: 2, p: 2, borderRadius: 2, border: '1px dashed', borderColor: '#E2E8F0', bgcolor: '#FAFBFC' }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6875rem', display: 'block', mb: 1 }}>
            Upload Temporary Signature
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', mb: 1.5 }}>
            This will override the business signature for this quotation only. Business defaults remain unchanged.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {activeBusinessSigs.map((bizSig) => {
              const currentSig = getSigForType(bizSig.type);
              return (
                <Button
                  key={bizSig._id}
                  component="label"
                  variant="outlined"
                  size="small"
                  startIcon={<UploadFileIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Replace {bizSig.displayName}
                  <input
                    hidden
                    type="file"
                    accept={ACCEPTED}
                    ref={(el) => { fileInputRefs.current[bizSig.type] = el; }}
                    onChange={(e) => handleFile(bizSig.type, e.target.files?.[0])}
                  />
                </Button>
              );
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
