import { Box, Typography } from '@mui/material';

export default function EmptyState({ title, description }) {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 3, md: 4 },
        textAlign: 'center',
        border: '2px dashed',
        borderColor: '#ECECEC',
        borderRadius: 4,
        bgcolor: '#FAFAFA',
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary', mb: 0.75, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
        {description}
      </Typography>
    </Box>
  );
}
