import { USER_ROLES } from '@/constants/roles';

export const mockActivities = [
  {
    id: 'act_1',
    businessId: 'biz_1',
    action: 'Quotation Request Submitted',
    userId: 'user_2',
    userName: 'Neha Sharma',
    role: USER_ROLES.CUSTOMER,
    date: '2025-04-10T09:00:00Z',
    details: 'REQ-2025-001 submitted.',
  },
  {
    id: 'act_2',
    businessId: 'biz_1',
    action: 'Quotation Created',
    userId: 'user_1',
    userName: 'Aarav Patel',
    role: USER_ROLES.BUSINESS,
    date: '2025-04-11T09:30:00Z',
    details: 'NS-QT-2025-0001 drafted.',
  },
  {
    id: 'act_3',
    businessId: 'biz_1',
    action: 'Quotation Sent',
    userId: 'user_1',
    userName: 'Aarav Patel',
    role: USER_ROLES.BUSINESS,
    date: '2025-04-11T10:00:00Z',
    details: 'NS-QT-2025-0001 sent to Green Horizon Ltd.',
  },
  {
    id: 'act_4',
    businessId: 'biz_2',
    action: 'Quotation Accepted',
    userId: 'user_5',
    userName: 'Priya Desai',
    role: USER_ROLES.CUSTOMER,
    date: '2025-04-15T14:30:00Z',
    details: 'BB-2025-0001 accepted by TechFlow Inc.',
  }
];
