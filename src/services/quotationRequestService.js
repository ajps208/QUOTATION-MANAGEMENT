export const quotationRequestService = {
  async getRequests(businessId, customerId) {
    const params = new URLSearchParams();
    if (businessId) params.set('businessId', businessId);
    if (customerId) params.set('customerId', customerId);
    const res = await fetch(`/api/requests?${params}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch requests');
    return data;
  },

  async getRequestById(id) {
    const res = await fetch(`/api/requests/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request not found');
    return data;
  },

  async createRequest(payload) {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create request');
    return data;
  },

  async submitRequest(payload) {
    return this.createRequest(payload);
  },

  async updateRequest(id, updates) {
    const res = await fetch(`/api/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update request');
    return data;
  },

  async updateRequestStatus(id, status) {
    return this.updateRequest(id, { status });
  },

  async deleteRequest(id) {
    const res = await fetch(`/api/requests/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete request');
    return data;
  },

  // Alias used in some pages
  async getRequestsByBusiness(businessId) {
    return this.getRequests(businessId, null);
  },

  async getRequestsByCustomer(customerId) {
    return this.getRequests(null, customerId);
  },
};
