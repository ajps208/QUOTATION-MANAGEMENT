'use client';
import { useState, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Collapse, IconButton, Tooltip,
  CircularProgress, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AppButton from '@/components/common/AppButton';

export default function SettingsSection({
  title,
  description,
  icon,
  children,
  editContent,
  onSave,
  isEditing: externalIsEditing,
  onEditChange,
  loading = false,
  defaultExpanded = true,
  collapsible = true,
  sx = {},
  canSave = true,
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [internalEditing, setInternalEditing] = useState(false);

  const expanded = externalIsEditing !== undefined ? true : internalExpanded;
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalEditing;

  const setEditing = useCallback((val) => {
    if (onEditChange) onEditChange(val);
    else setInternalEditing(val);
  }, [onEditChange]);

  const handleCancel = useCallback(() => {
    setEditing(false);
  }, [setEditing]);

  const handleSave = useCallback(async () => {
    if (onSave) {
      await onSave();
      setEditing(false);
    }
  }, [onSave, setEditing]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: isEditing ? 'primary.light' : 'divider',
        boxShadow: isEditing
          ? '0 0 0 1px rgba(79,70,229,0.1), 0 4px 16px rgba(79,70,229,0.06)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
        ...sx,
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: { xs: 2.5, sm: 3 },
            py: 2,
            cursor: collapsible ? 'pointer' : 'default',
            '&:hover': collapsible ? { bgcolor: 'grey.50' } : {},
            transition: 'background-color 0.15s',
          }}
          onClick={collapsible ? () => setInternalExpanded(!internalExpanded) : undefined}
        >
          {icon && (
            <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
              {icon}
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.3 }}>
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', mt: 0.25 }}>
                {description}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            {isEditing ? (
              <>
                <Tooltip title="Cancel">
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                    sx={{ color: 'text.secondary' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <AppButton
                  variant="contained"
                  size="small"
                  startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <CheckIcon sx={{ fontSize: 16 }} />}
                  onClick={(e) => { e.stopPropagation(); handleSave(); }}
                  disabled={!canSave || loading}
                  loading={loading}
                  loadingText="Saving..."
                  sx={{ minWidth: 100 }}
                >
                  Save
                </AppButton>
              </>
            ) : (
              <Tooltip title="Edit section">
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); setEditing(true); }}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', bgcolor: 'primary.lighter' },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {collapsible && (
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                {internalExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            )}
          </Box>
        </Box>
        <Collapse in={expanded} timeout="auto">
          <Divider />
          <Box sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
            {isEditing ? (editContent || children) : children}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
