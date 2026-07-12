export const templateService = {
  async getTemplates() {
    const res = await fetch('/api/templates');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch templates');
    return data;
  },
};
