import { mockCustomers } from '@/data/mock';
import { generateId } from '@/utils/helpers';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let customers = [...mockCustomers];

export const customerService = {
  async getCustomers(businessId) {
    await delay(300);
    return customers.filter(c => c.businessId === businessId);
  },

  async getCustomerById(id) {
    await delay(300);
    const customer = customers.find(c => c.id === id);
    if (!customer) throw new Error('Customer not found');
    return { ...customer };
  },

  async createCustomer(data) {
    await delay(400);
    const newCustomer = {
      id: generateId(),
      ...data,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    customers.push(newCustomer);
    return { ...newCustomer };
  },

  async updateCustomer(id, updates) {
    await delay(400);
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    
    customers[index] = { ...customers[index], ...updates };
    return { ...customers[index] };
  },

  async deleteCustomer(id) {
    await delay(400);
    customers = customers.filter(c => c.id !== id);
    return { success: true };
  }
};
