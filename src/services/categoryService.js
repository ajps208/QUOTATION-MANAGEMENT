export const categoryService = {
  async getCategories(businessId) {
    const url = businessId ? `/api/categories?businessId=${businessId}` : '/api/categories';
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch categories');
    return data;
  },

  async getCategoryById(id) {
    const res = await fetch(`/api/categories/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Category not found');
    return data;
  },

  async createCategory(payload) {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    return data;
  },

  async updateCategory(id, updates) {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update category');
    return data;
  },

  async deleteCategory(id) {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
    return data;
  },
};
