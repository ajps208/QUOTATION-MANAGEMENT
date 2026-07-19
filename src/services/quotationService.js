export const quotationService = {
  async getQuotations(businessId, customerId, userId) {
    const params = new URLSearchParams();
    if (businessId) params.set('businessId', businessId);
    if (customerId) params.set('customerId', customerId);
    if (userId) params.set('userId', userId);
    const res = await fetch(`/api/quotations?${params}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch quotations');
    return data;
  },

  async getQuotationById(id, userId) {
    const params = new URLSearchParams();
    if (userId) params.set('userId', userId);
    const qs = params.toString();
    const res = await fetch(`/api/quotations/${id}${qs ? `?${qs}` : ''}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Quotation not found');
    return data;
  },

  async createQuotation(payload) {
    const res = await fetch('/api/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create quotation');
    return data;
  },

  async updateQuotation(id, updates) {
    const res = await fetch(`/api/quotations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update quotation');
    return data;
  },

  async deleteQuotation(id) {
    const res = await fetch(`/api/quotations/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete quotation');
    return data;
  },

  async updateQuotationStatus(id, status) {
    return this.updateQuotation(id, { status });
  },

  async getQuotationsByBusiness(businessId) {
    return this.getQuotations(businessId, null);
  },

  async getQuotationsByCustomer(customerId) {
    return this.getQuotations(null, customerId);
  },

  async getQuotationsByUser(userId) {
    return this.getQuotations(null, null, userId);
  },
};
