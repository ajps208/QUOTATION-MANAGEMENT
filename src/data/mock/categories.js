import { CATEGORY_STATUS } from '@/constants/statuses';

export const mockCategories = [
  {
    id: 'cat_1',
    businessId: 'biz_1',
    name: 'Software Licenses',
    description: 'Enterprise software licenses and subscriptions',
    image: null,
    status: CATEGORY_STATUS.ACTIVE,
    createdAt: '2025-01-11T10:00:00Z',
    updatedAt: '2025-01-11T10:00:00Z',
  },
  {
    id: 'cat_2',
    businessId: 'biz_1',
    name: 'Consulting',
    description: 'IT consulting and advisory services',
    image: null,
    status: CATEGORY_STATUS.ACTIVE,
    createdAt: '2025-01-11T10:30:00Z',
    updatedAt: '2025-01-11T10:30:00Z',
  },
  {
    id: 'cat_3',
    businessId: 'biz_2',
    name: 'Interior Design',
    description: 'Commercial and residential interior design services',
    image: null,
    status: CATEGORY_STATUS.ACTIVE,
    createdAt: '2025-02-16T11:00:00Z',
    updatedAt: '2025-02-16T11:00:00Z',
  },
  {
    id: 'cat_4',
    businessId: 'biz_3',
    name: 'Branding',
    description: 'Brand identity design and strategy',
    image: null,
    status: CATEGORY_STATUS.ACTIVE,
    createdAt: '2025-03-21T09:00:00Z',
    updatedAt: '2025-03-21T09:00:00Z',
  },
  {
    id: 'cat_5',
    businessId: 'biz_3',
    name: 'Digital Marketing',
    description: 'SEO, social media, and paid advertising',
    image: null,
    status: CATEGORY_STATUS.ACTIVE,
    createdAt: '2025-03-21T09:15:00Z',
    updatedAt: '2025-03-21T09:15:00Z',
  }
];
