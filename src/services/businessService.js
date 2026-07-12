export const businessService = {
  async getBusinesses() {
    const res = await fetch('/api/business');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch businesses');
    return data;
  },

  async getBusinessById(id) {
    const res = await fetch(`/api/business/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Business not found');
    return data;
  },

  async createBusiness(payload) {
    const res = await fetch('/api/business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create business');
    return data;
  },

  async updateBusiness(id, updates) {
    const res = await fetch(`/api/business/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update business');
    return data;
  },

  async searchBusinesses(query) {
    const res = await fetch(`/api/business?search=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Search failed');
    return data;
  },
};
