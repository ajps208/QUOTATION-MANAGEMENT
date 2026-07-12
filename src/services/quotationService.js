import { mockQuotations } from '@/data/mock';
import { generateId, generateQuotationNumber } from '@/utils/helpers';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let quotations = [...mockQuotations];

export const quotationService = {
  async getQuotationsByBusiness(businessId) {
    await delay(300);
    return quotations.filter(q => q.businessId === businessId);
  },

  async getQuotationsByCustomer(customerId) {
    await delay(300);
    return quotations.filter(q => q.customerId === customerId);
  },

  async getQuotationById(id) {
    await delay(300);
    const quot = quotations.find(q => q.id === id);
    if (!quot) throw new Error('Quotation not found');
    return { ...quot };
  },

  async createQuotation(data) {
    await delay(500);
    // Auto calculate totals if not provided
    const totals = calculateQuotationTotals(data);
    
    const newQuot = {
      id: generateId(),
      quotationNumber: generateQuotationNumber(data.prefix || 'QT', quotations.length + 1),
      ...data,
      ...totals,
      status: QUOTATION_STATUS.DRAFT,
      revision: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    quotations.push(newQuot);
    return { ...newQuot };
  },

  async updateQuotation(id, updates) {
    await delay(400);
    const index = quotations.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quotation not found');
    
    const merged = { ...quotations[index], ...updates };
    // Recalculate totals
    const totals = calculateQuotationTotals(merged);
    
    quotations[index] = { 
      ...merged, 
      ...totals,
      updatedAt: new Date().toISOString() 
    };
    return { ...quotations[index] };
  },

  async updateQuotationStatus(id, status) {
    await delay(300);
    const index = quotations.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quotation not found');
    
    quotations[index] = { ...quotations[index], status, updatedAt: new Date().toISOString() };
    return { ...quotations[index] };
  },

  async createRevision(id, updates) {
    await delay(500);
    const index = quotations.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quotation not found');
    
    const baseQuot = quotations[index];
    const newQuot = {
      ...baseQuot,
      ...updates,
      id: generateId(),
      revision: baseQuot.revision + 1,
      status: QUOTATION_STATUS.REVISED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const totals = calculateQuotationTotals(newQuot);
    const finalQuot = { ...newQuot, ...totals };
    
    quotations.push(finalQuot);
    return { ...finalQuot };
  }
};
