import { mockQuotationSettings, defaultQuotationSettings } from '@/data/mock';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store (simulates a DB collection, keyed by businessId)
let settingsStore = [...mockQuotationSettings];

export const quotationSettingsService = {
  /**
   * Get quotation settings for a specific business.
   * Returns default settings if none found.
   * MongoDB: db.quotationSettings.findOne({ businessId })
   */
  async getSettingsByBusiness(businessId) {
    await delay(200);
    const found = settingsStore.find(s => s.businessId === businessId);
    return found ? { ...found } : { ...defaultQuotationSettings, businessId };
  },

  /**
   * Save (upsert) quotation settings for a business.
   * MongoDB: db.quotationSettings.updateOne({ businessId }, { $set: data }, { upsert: true })
   */
  async saveSettings(businessId, data) {
    await delay(300);
    const idx = settingsStore.findIndex(s => s.businessId === businessId);
    const updated = { ...data, businessId, updatedAt: new Date().toISOString() };
    if (idx !== -1) {
      settingsStore[idx] = updated;
    } else {
      settingsStore.push(updated);
    }
    return { ...updated };
  },

  /**
   * Reset settings to default for a business.
   */
  async resetSettings(businessId) {
    await delay(200);
    const reset = { ...defaultQuotationSettings, businessId, updatedAt: new Date().toISOString() };
    const idx = settingsStore.findIndex(s => s.businessId === businessId);
    if (idx !== -1) {
      settingsStore[idx] = reset;
    } else {
      settingsStore.push(reset);
    }
    return { ...reset };
  },
};
