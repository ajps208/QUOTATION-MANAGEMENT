export const productService = {
  async getProducts(businessId) {
    const url = businessId ? `/api/products?businessId=${businessId}` : '/api/products';
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
    return data;
  },

  async getProductById(id) {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Product not found');
    return data;
  },

  async createProduct(payload) {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create product');
    return data;
  },

  async updateProduct(id, updates) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data;
  },

  async deleteProduct(id) {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete product');
    return data;
  },
};
