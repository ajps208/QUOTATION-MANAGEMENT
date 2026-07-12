export const quotationSettingsService = {
  async getSettingsByBusiness(businessId) {
    const res = await fetch(`/api/settings?businessId=${businessId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch settings');
    return data;
  },

  async updateSettings(businessId, updates) {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, ...updates }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  },
};
