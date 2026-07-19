'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Chip, IconButton, Collapse, Card, CardContent,
} from '@mui/material';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineContent,
} from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

import { quotationService } from '@/services/quotationService';
import { formatDateTime } from '@/utils/formatters';
import StatusChip from '@/components/common/StatusChip';

const FIELD_LABELS = {
  items: 'Line Items',
  customerNotes: 'Customer Notes',
  expiryDate: 'Expiry Date',
  status: 'Status',
  rejectionReason: 'Rejection Reason',
  'items[].quantity': 'Item Quantities',
};

function getFieldLabel(field) {
  if (FIELD_LABELS[field]) return FIELD_LABELS[field];
  if (field.startsWith('items[')) {
    const match = field.match(/items\[(\d+)\]\.(\w+)/);
    if (match) return `Item ${parseInt(match[1]) + 1} ${match[2]}`;
  }
  return field;
}

export default function RevisionTimeline({ quotationId, refreshKey }) {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const initRef = useRef(null);

  const fetchRevisions = async () => {
    try {
      setLoading(true);
      const data = await quotationService.getRevisions(quotationId);
      setRevisions(data);
    } catch {
      setRevisions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quotationId && (!initRef.current || refreshKey > 0)) {
      initRef.current = true;
      fetchRevisions();
    }
  }, [quotationId, refreshKey]);

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>Loading revision history...</Typography>;
  }

  if (revisions.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Revision History</Typography>
        <Typography variant="body2" color="text.secondary">No revisions yet.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Revision History ({revisions.length})</Typography>
      <Timeline sx={{ p: 0, '& .MuiTimelineItem-root': { minHeight: 'auto' } }}>
        {revisions.map((rev, idx) => (
          <TimelineItem key={rev.id} sx={{ '&::before': { display: 'none' } }}>
            <TimelineSeparator>
              <TimelineDot
                color={rev.changedByRole === 'customer' ? 'success' : 'primary'}
                sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {rev.changedByRole === 'customer' ? <PersonIcon sx={{ fontSize: 16 }} /> : <BusinessIcon sx={{ fontSize: 16 }} />}
              </TimelineDot>
              {idx < revisions.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ pb: 2 }}>
              <Card variant="outlined" sx={{ mb: 0.5 }}>
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Revision {rev.revisionNumber}
                    </Typography>
                    <StatusChip status={rev.status} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(rev.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    by {rev.changedByName} ({rev.changedByRole})
                  </Typography>

                  {rev.changedFields && rev.changedFields.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {rev.changedFields.map((field) => (
                          <Chip key={field} label={getFieldLabel(field)} size="small" variant="outlined" color="warning" />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {rev.remarks && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary">Remarks:</Typography>
                      <Typography variant="body2" sx={{ mt: 0.25, fontStyle: 'italic', color: 'text.secondary' }}>
                        {rev.remarks}
                      </Typography>
                    </Box>
                  )}

                  {rev.quotationSnapshot && (
                    <Box sx={{ mt: 1 }}>
                      <IconButton size="small" onClick={() => toggleExpand(rev.id)} sx={{ p: 0 }}>
                        <Typography variant="caption" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {expanded[rev.id] ? <ExpandLessIcon sx={{ fontSize: 14 }} /> : <ExpandMoreIcon sx={{ fontSize: 14 }} />}
                          {expanded[rev.id] ? 'Hide snapshot' : 'View snapshot'}
                        </Typography>
                      </IconButton>
                      <Collapse in={!!expanded[rev.id]}>
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.50', borderRadius: 1, fontSize: '0.8125rem' }}>
                          <Typography variant="caption" fontWeight={600}>Snapshot at Revision {rev.revisionNumber}:</Typography>
                          <Box component="pre" sx={{ mt: 0.5, fontSize: '0.75rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 300, overflow: 'auto' }}>
                            {JSON.stringify(rev.quotationSnapshot, null, 2)}
                          </Box>
                        </Box>
                      </Collapse>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}
