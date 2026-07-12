import { mockQuotationRequests } from '@/data/mock';
import { generateRequestId } from '@/utils/helpers';
import { REQUEST_STATUS } from '@/constants/statuses';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let requests = [...mockQuotationRequests];

export const quotationRequestService = {
  async getRequestsByBusiness(businessId) {
    await delay(300);
    return requests.filter(r => r.businessId === businessId);
  },

  async getRequestsByCustomer(customerId) {
    await delay(300);
    return requests.filter(r => r.customerId === customerId);
  },

  async getRequestById(id) {
    await delay(300);
    const req = requests.find(r => r.id === id);
    if (!req) throw new Error('Request not found');
    return { ...req };
  },

  async submitRequest(data) {
    await delay(500);
    const newReq = {
      id: generateRequestId(),
      ...data,
      requestDate: new Date().toISOString(),
      status: REQUEST_STATUS.SUBMITTED,
    };
    requests.push(newReq);
    return { ...newReq };
  },

  async updateRequestStatus(id, status) {
    await delay(400);
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    
    requests[index] = { ...requests[index], status };
    return { ...requests[index] };
  }
};
