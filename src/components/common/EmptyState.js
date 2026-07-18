'use client';

import { Box, Typography, Button, SvgIcon } from '@mui/material';
import { 
  AssignmentRounded, 
  PersonAddRounded, 
  Inventory2Rounded, 
  CategoryRounded,
  MailOutlineRounded,
  SearchOffRounded,
  ErrorOutlineRounded,
  NotificationImportantRounded,
  InsertChartOutlinedRounded,
  DescriptionRounded,
  ReceiptLongRounded,
  PeopleAltRounded,
  ShoppingBagRounded,
  ArticleRounded,
  VisibilityOffRounded,
  InboxRounded,
  AssessmentRounded,
  SettingsRounded,
  DashboardRounded,
  LocalOfferRounded,
  LibraryBooksRounded,
  PeopleRounded,
  ShoppingCartRounded,
  FavoriteRounded,
  HistoryRounded,
  CloudOffRounded,
  WarningRounded,
  InfoRounded,
  CheckCircleRounded,
  AddCircleRounded
} from '@mui/icons-material';

const illustrations = {
  quotations: (
    <SvgIcon sx={{ fontSize: 64, color: '#1F6B47', opacity: 0.6 }} component="svg" viewBox="0 0 24 24">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </SvgIcon>
  ),
  requests: (
    <SvgIcon sx={{ fontSize: 64, color: '#F4B740', opacity: 0.6 }} component="svg" viewBox="0 0 24 24">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </SvgIcon>
  ),
  customers: (
    <SvgIcon sx={{ fontSize: 64, color: '#1F6B47', opacity: 0.6 }} component="svg" viewBox="0 0 24 24">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </SvgIcon>
  ),
  products: (
    <SvgIcon sx={{ fontSize: 64, color: '#5F6B62', opacity: 0.6 }} component="svg" viewBox="0 0 24 24">
      <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
      <path d="M6 14h12v2H6zm0-4h12v2H6zm0-4h12v2H6z"/>
    </SvgIcon>
  ),
  categories: (
    <SvgIcon sx={{ fontSize: 64, color: '#F4B740', opacity: 0.6 }} component="svg" viewBox="0 0 24 24">
      <path d="M4 6H2v14c0 1.1.9 2 2h14v-2H4V6zm16-4H8l-2-2H2v16h16V2z"/>
      <path d="M13 4v6h6v6h-2v-6H7v-2h6V4h2z"/>
    </SvgIcon>
  ),
  notifications: (
    <SvgIcon sx={{ fontSize: 64, color: '#1F6B47', opacity: 0.6 }} component="svg" viewBox="0 0 24 24">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 3.5-4.5s3.5 2.02 3.5 4.5v6z"/>
    </SvgIcon>
  ),
  search: (
    <SvgIcon sx={{ fontSize: 64, color: '#A2A8A4', opacity: 0.5 }} component="svg" viewBox="0 0 24 24">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </SvgIcon>
  ),
  error: (
    <SvgIcon sx={{ fontSize: 64, color: '#E57373', opacity: 0.6 }} component="svg" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </SvgIcon>
  ),
  reports: (
    <SvgIcon sx={{ fontSize: 64, color: '#5F6B62', opacity: 0.6 }} component="svg" viewBox="0 0 24 24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
    </SvgIcon>
  ),
  activity: (
    <SvgIcon sx={{ fontSize: 64, color: '#1F6B47', opacity: 0.6 }} component="svg" viewBox="0 0 24 24">
      <path d="M13 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
    </SvgIcon>
  ),
  templates: (
    <SvgIcon sx={{ fontSize: 64, color: '#5F6B62', opacity: 0.6 }} component="svg" viewBox="0 0 24 24">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </SvgIcon>
  ),
  general: (
    <SvgIcon sx={{ fontSize: 64, color: '#A2A8A4', opacity: 0.5 }} component="svg" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </SvgIcon>
  ),
};

const emptyStateConfigs = {
  quotations: {
    icon: illustrations.quotations,
    title: 'No Quotations Yet',
    description: 'Start creating professional quotations to win more business.',
    actionLabel: 'Create Quotation',
    actionIcon: <AddCircleRounded sx={{ fontSize: 20 }} />,
  },
  requests: {
    icon: illustrations.requests,
    title: 'No Requests Received',
    description: 'Quotation requests from customers will appear here.',
    actionLabel: 'Create Quotation',
    actionIcon: <AddCircleRounded sx={{ fontSize: 20 }} />,
  },
  customers: {
    icon: illustrations.customers,
    title: 'No Customers Added',
    description: 'Add your first customer to start building your client database.',
    actionLabel: 'Add Customer',
    actionIcon: <PersonAddRounded sx={{ fontSize: 20 }} />,
  },
  products: {
    icon: illustrations.products,
    title: 'No Products or Services',
    description: 'Create items for your catalog to quickly add them to quotations.',
    actionLabel: 'Add Product',
    actionIcon: <AddCircleRounded sx={{ fontSize: 20 }} />,
  },
  categories: {
    icon: illustrations.categories,
    title: 'No Categories Created',
    description: 'Organize your products and services with categories.',
    actionLabel: 'Add Category',
    actionIcon: <AddCircleRounded sx={{ fontSize: 20 }} />,
  },
  notifications: {
    icon: illustrations.notifications,
    title: 'No Notifications',
    description: "You're all caught up! New notifications will appear here.",
    actionLabel: null,
    actionIcon: null,
  },
  search: {
    icon: illustrations.search,
    title: 'No Results Found',
    description: 'Try adjusting your search query or filters.',
    actionLabel: 'Clear Filters',
    actionIcon: <SearchOffRounded sx={{ fontSize: 20 }} />,
  },
  reports: {
    icon: illustrations.reports,
    title: 'No Reports Available',
    description: 'Generate reports once you have quotation data.',
    actionLabel: 'Create Quotation',
    actionIcon: <AddCircleRounded sx={{ fontSize: 20 }} />,
  },
  activity: {
    icon: illustrations.activity,
    title: 'No Recent Activity',
    description: 'Activity will appear here as you create and manage quotations.',
    actionLabel: 'Create Quotation',
    actionIcon: <AddCircleRounded sx={{ fontSize: 20 }} />,
  },
  templates: {
    icon: illustrations.templates,
    title: 'No Templates Saved',
    description: 'Save frequently used quotations as templates to save time.',
    actionLabel: 'Create Template',
    actionIcon: <AddCircleRounded sx={{ fontSize: 20 }} />,
  },
  error: {
    icon: illustrations.error,
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again.',
    actionLabel: 'Retry',
    actionIcon: <CheckCircleRounded sx={{ fontSize: 20 }} />,
  },
  networkError: {
    icon: illustrations.error,
    title: 'Connection Lost',
    description: 'Please check your internet connection and try again.',
    actionLabel: 'Retry',
    actionIcon: <CheckCircleRounded sx={{ fontSize: 20 }} />,
  },
  unauthorized: {
    icon: illustrations.error,
    title: 'Access Denied',
    description: "You don't have permission to view this content. Please log in or contact your administrator.",
    actionLabel: 'Log In',
    actionIcon: <AddCircleRounded sx={{ fontSize: 20 }} />,
  },
  notFound: {
    icon: illustrations.search,
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved.",
    actionLabel: 'Go Home',
    actionIcon: <DashboardRounded sx={{ fontSize: 20 }} />,
  },
  general: {
    icon: illustrations.general,
    title: 'No Data Available',
    description: "There's nothing to show here yet.",
    actionLabel: null,
    actionIcon: null,
  },
};

function getEmptyStateConfig(type, overrides = {}) {
  const config = emptyStateConfigs[type] || emptyStateConfigs.general;
  return { ...config, ...overrides };
}

export default function EmptyState({
  type = 'general',
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  illustration,
  variant = 'default',
  size = 'md',
}) {
  const config = getEmptyStateConfig(type, {
    title,
    description,
    actionLabel,
    actionIcon,
    illustration,
  });

  const sizeStyles = {
    sm: { iconSize: 48, titleSize: '1rem', descSize: '0.8125rem', padding: { xs: 3, md: 4 }, gap: 1.5 },
    md: { iconSize: 64, titleSize: '1.125rem', descSize: '0.875rem', padding: { xs: 4, md: 5 }, gap: 2 },
    lg: { iconSize: 80, titleSize: '1.25rem', descSize: '1rem', padding: { xs: 5, md: 6 }, gap: 2.5 },
    xl: { iconSize: 96, titleSize: '1.5rem', descSize: '1.125rem', padding: { xs: 6, md: 8 }, gap: 3 },
  };

  const variantStyles = {
    default: {
      container: {
        py: sizeStyles[size].padding,
        px: { xs: 3, md: 4 },
        textAlign: 'center',
        border: '2px dashed',
        borderColor: '#ECECEC',
        borderRadius: 4,
        bgcolor: '#FAFAFA',
      },
      title: { fontWeight: 600, color: 'text.primary' },
      description: { color: 'text.secondary', maxWidth: 400, mx: 'auto' },
    },
    card: {
      container: {
        py: sizeStyles[size].padding,
        px: { xs: 3, md: 4 },
        textAlign: 'center',
      },
      title: { fontWeight: 600, color: 'text.primary' },
      description: { color: 'text.secondary', maxWidth: 400, mx: 'auto' },
    },
    inline: {
      container: {
        py: 3,
        px: 2,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: sizeStyles[size].gap,
      },
      title: { fontWeight: 600, color: 'text.primary' },
      description: { color: 'text.secondary', maxWidth: 300 },
    },
    page: {
      container: {
        minHeight: { xs: '50vh', md: '60vh' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, md: 4 },
        gap: sizeStyles[size].gap,
      },
      title: { fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' },
      description: { color: 'text.secondary', maxWidth: 500, textAlign: 'center', lineHeight: 1.7 },
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  const iconElement = config.illustration || config.icon;

  return (
    <Box sx={styles.container}>
      {iconElement && (
        <Box sx={{ mb: sizeStyles[size].gap, display: 'flex', justifyContent: 'center' }}>
          {iconElement}
        </Box>
      )}
      <Typography
        variant="h6"
        sx={{
          fontSize: sizeStyles[size].titleSize,
          fontWeight: styles.title.fontWeight,
          color: styles.title.color,
          letterSpacing: styles.title.letterSpacing,
          mb: 1,
          lineHeight: 1.3,
        }}
      >
        {config.title}
      </Typography>
      {config.description && (
        <Typography
          variant="body2"
          sx={{
            fontSize: sizeStyles[size].descSize,
            color: styles.description.color,
            maxWidth: styles.description.maxWidth,
            mx: styles.description.mx,
            textAlign: styles.description.textAlign || 'center',
            lineHeight: styles.description.lineHeight || 1.6,
          }}
        >
          {config.description}
        </Typography>
      )}
      {config.actionLabel && onAction && (
        <Box sx={{ mt: sizeStyles[size].gap, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={config.actionIcon}
            onClick={onAction}
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 12px rgba(31,107,71,0.2)' },
            }}
          >
            {config.actionLabel}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export { emptyStateConfigs, illustrations, getEmptyStateConfig };