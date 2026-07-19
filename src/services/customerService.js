export const customerService = {
  async getCustomers(businessId) {
    const url = businessId ? `/api/customers?businessId=${businessId}` : '/api/customers';
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch customers');
    return data;
  },

  async getCustomerById(id) {
    const res = await fetch(`/api/customers/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Customer not found');
    return data;
  },

  async createCustomer(payload) {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create customer');
    return data;
  },

  async updateCustomer(id, updates) {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update customer');
    return data;
  },

  async deleteCustomer(id) {
    const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete customer');
    return data;
  },

  async getQuotationRequests(customerId) {
    const params = new URLSearchParams();
    if (customerId) params.set('customerId', customerId);
    const res = await fetch(`/api/requests?${params}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch quotation requests');
    return data;
  },
};
