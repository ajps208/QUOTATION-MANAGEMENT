import { Card, CardHeader, CardContent, CardActions, Divider, Box } from '@mui/material';

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
            titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
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
          <CardActions sx={{ p: 2, justifyContent: 'flex-end', backgroundColor: 'background.default' }}>
            {footer}
          </CardActions>
        </>
      )}
    </Card>
  );
}
