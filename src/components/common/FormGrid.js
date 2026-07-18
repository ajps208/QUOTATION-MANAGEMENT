import { Grid } from '@mui/material';

export default function FormGrid({ children, spacing = 2.5, ...props }) {
  return (
    <Grid container spacing={spacing} {...props}>
      {children}
    </Grid>
  );
}

export function FormField({ xs = 12, sm, md, lg, children, ...props }) {
  return (
    <Grid xs={xs} sm={sm} md={md} lg={lg} {...props}>
      {children}
    </Grid>
  );
}
