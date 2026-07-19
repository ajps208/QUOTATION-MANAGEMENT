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

  async deleteBusiness(id) {
    const res = await fetch(`/api/business/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete business');
    return data;
  },

  async searchBusinesses(query) {
    const res = await fetch(`/api/business?search=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Search failed');
    return data;
  },

  async getSection(id, section) {
    const res = await fetch(`/api/business/${id}/settings/${section}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed to fetch ${section}`);
    return data;
  },

  async updateSection(id, section, data) {
    const res = await fetch(`/api/business/${id}/settings/${section}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || `Failed to update ${section}`);
    return result;
  },

  async getSignatures(id) {
    const res = await fetch(`/api/business/${id}/settings/signatures`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch signatures');
    return data;
  },

  async updateSignatures(id, signatures) {
    const res = await fetch(`/api/business/${id}/settings/signatures`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signatures }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update signatures');
    return data;
  },

  async deleteSignature(id, signatureId) {
    const res = await fetch(`/api/business/${id}/settings/signatures?signatureId=${signatureId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete signature');
    return data;
  },

  async getQuotationSettings(id) {
    const res = await fetch(`/api/business/${id}/settings/quotation-defaults`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch quotation settings');
    return data;
  },

  async updateQuotationSettings(id, settings) {
    const res = await fetch(`/api/business/${id}/settings/quotation-defaults`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update quotation settings');
    return data;
  },
};
