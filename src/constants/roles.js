import { ROUTES } from './routes';
export { ROUTES };

export const USER_ROLES = {
  BUSINESS: 'business',
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

export const BUSINESS_NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.BUSINESS.DASHBOARD },
  { label: 'Categories', href: ROUTES.BUSINESS.CATEGORIES },
  { label: 'Products', href: ROUTES.BUSINESS.PRODUCTS },
  { label: 'Customers', href: ROUTES.BUSINESS.CUSTOMERS },
  { label: 'Requests', href: ROUTES.BUSINESS.QUOTATION_REQUESTS },
  { label: 'Quotations', href: ROUTES.BUSINESS.QUOTATIONS },
  { label: 'Templates', href: ROUTES.BUSINESS.TEMPLATES },
  { label: 'Notifications', href: ROUTES.BUSINESS.NOTIFICATIONS },
  { label: 'Settings', href: ROUTES.BUSINESS.SETTINGS },
];

export const CUSTOMER_NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.CUSTOMER.DASHBOARD },
  { label: 'Businesses', href: ROUTES.CUSTOMER.BUSINESSES },
  { label: 'Favourites', href: ROUTES.CUSTOMER.FAVOURITES },
  { label: 'Requests', href: ROUTES.CUSTOMER.QUOTATION_REQUESTS },
  { label: 'Quotations', href: ROUTES.CUSTOMER.QUOTATIONS },
  { label: 'Notifications', href: ROUTES.CUSTOMER.NOTIFICATIONS },
  { label: 'Profile', href: ROUTES.CUSTOMER.PROFILE },
];
