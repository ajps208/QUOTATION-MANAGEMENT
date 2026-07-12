import { mockQuotationTemplates } from '@/data/mock';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let templates = [...mockQuotationTemplates];

export const templateService = {
  async getTemplates() {
    await delay(200);
    return [...templates];
  },

  async getTemplateById(id) {
    await delay(200);
    const template = templates.find(t => t.id === id);
    if (!template) throw new Error('Template not found');
    return { ...template };
  }
};
