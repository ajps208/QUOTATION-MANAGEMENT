import { Card, CardContent, Box, Typography, Divider } from '@mui/material';

export default function FormSection({
  title,
  description,
  children,
  sx = {},
  contentSx = {},
  divider = false,
  noPadding = false,
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        ...sx,
      }}
    >
      <CardContent
        sx={{
          p: noPadding ? 0 : { xs: 2.5, sm: 3 },
          '&:last-child': { pb: noPadding ? 0 : 3 },
          ...contentSx,
        }}
      >
        {(title || description) && (
          <Box sx={{ mb: title ? 2.5 : 0, px: noPadding ? { xs: 2.5, sm: 3 } : 0, pt: noPadding ? 3 : 0 }}>
            {title && (
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'text.primary',
                  lineHeight: 1.4,
                }}
              >
                {title}
              </Typography>
            )}
            {description && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mt: title ? 0.5 : 0,
                  lineHeight: 1.5,
                  fontSize: '0.8125rem',
                }}
              >
                {description}
              </Typography>
            )}
            {divider && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            ...(!title && !description && { pt: 0 }),
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
