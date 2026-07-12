import { REQUEST_STATUS } from '@/constants/statuses';

export const mockQuotationRequests = [
  {
    id: 'REQ-2025-001',
    customerId: 'cust_1',
    businessId: 'biz_1',
    items: [
      {
        productId: 'prod_1',
        name: 'ERP Starter Pack',
        quantity: 1,
        notes: 'We need this implementation for our new branch.',
      },
      {
        productId: 'prod_2',
        name: 'Cloud Migration Advisory',
        quantity: 20,
        notes: 'Assuming 20 hours for the initial strategy phase.',
      }
    ],
    generalNote: 'Please provide your best quotation considering we are an existing customer looking to expand.',
    requestDate: '2025-04-10T09:00:00Z',
    status: REQUEST_STATUS.SUBMITTED,
  },
  {
    id: 'REQ-2025-002',
    customerId: 'cust_2',
    businessId: 'biz_2',
    items: [
      {
        productId: 'prod_3',
        name: 'Office Layout Design',
        quantity: 1,
        notes: 'For a 5000 sq ft office space.',
      }
    ],
    generalNote: 'Looking for modern, open-plan concepts.',
    requestDate: '2025-04-12T11:30:00Z',
    status: REQUEST_STATUS.UNDER_REVIEW,
  }
];
