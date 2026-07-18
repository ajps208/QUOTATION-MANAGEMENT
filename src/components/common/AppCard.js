import { Card, CardHeader, CardContent, CardActions, Divider } from '@mui/material';

export default function AppCard({
  title,
  subtitle,
  action,
  children,
  footer,
  noPadding = false,
  ...props
}) {
  return (
    <Card {...props}>
      {(title || subtitle || action) && (
        <>
          <CardHeader
            title={title}
            subheader={subtitle}
            action={action}
            titleTypographyProps={{ variant: 'h6', fontWeight: 600, letterSpacing: '-0.005em' }}
          />
          <Divider />
        </>
      )}
      <CardContent sx={noPadding ? { p: 0, '&:last-child': { pb: 0 } } : {}}>
        {children}
      </CardContent>
      {footer && (
        <>
          <Divider />
          <CardActions sx={{ p: { xs: 2, md: 3 }, justifyContent: 'flex-end' }}>
            {footer}
          </CardActions>
        </>
      )}
    </Card>
  );
}
