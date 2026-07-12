export const mockNotifications = [
  {
    id: 'notif_1',
    userId: 'user_1', // Aarav Patel (Business)
    title: 'New Quotation Request',
    message: 'Green Horizon Ltd has requested a new quotation (REQ-2025-001).',
    read: false,
    createdAt: '2025-04-10T09:05:00Z',
    link: '/business/quotation-requests/REQ-2025-001'
  },
  {
    id: 'notif_2',
    userId: 'user_2', // Neha Sharma (Customer)
    title: 'Quotation Received',
    message: 'Northstar Solutions has sent you a quotation (NS-QT-2025-0001).',
    read: true,
    createdAt: '2025-04-11T10:05:00Z',
    link: '/customer/quotations/quot_1'
  },
  {
    id: 'notif_3',
    userId: 'user_4', // Vikram Singh (Business)
    title: 'Quotation Accepted',
    message: 'TechFlow Inc. has accepted your quotation (BB-2025-0001).',
    read: false,
    createdAt: '2025-04-15T14:35:00Z',
    link: '/business/quotations/quot_2'
  }
];
