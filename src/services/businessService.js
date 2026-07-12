import { mockBusinesses } from '@/data/mock';
import { generateId } from '@/utils/helpers';
import { BUSINESS_STATUS } from '@/constants/statuses';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let businesses = [...mockBusinesses];

export const businessService = {
  async getBusinesses() {
    await delay(300);
    return [...businesses];
  },

  async getBusinessById(id) {
    await delay(300);
    const business = businesses.find(b => b.id === id);
    if (!business) throw new Error('Business not found');
    return { ...business };
  },

  async createBusiness(data) {
    await delay(500);
    const newBusiness = {
      id: generateId(),
      ...data,
      status: BUSINESS_STATUS.ACTIVE,
      createdAt: new Date().toISOString(),
      categories: [],
    };
    businesses.push(newBusiness);
    return { ...newBusiness };
  },

  async updateBusiness(id, updates) {
    await delay(400);
    const index = businesses.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Business not found');
    
    businesses[index] = { ...businesses[index], ...updates };
    return { ...businesses[index] };
  },

  async searchBusinesses(query) {
    await delay(300);
    const q = query.toLowerCase();
    return businesses.filter(b => 
      b.name.toLowerCase().includes(q) || 
      b.industry.toLowerCase().includes(q)
    );
  }
};
