import { mockProducts } from '@/data/mock';
import { generateId } from '@/utils/helpers';
import { PRODUCT_STATUS } from '@/constants/statuses';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let products = [...mockProducts];

export const productService = {
  async getProducts(businessId) {
    await delay(300);
    return products.filter(p => p.businessId === businessId);
  },

  async getProductById(id) {
    await delay(300);
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return { ...product };
  },

  async createProduct(data) {
    await delay(400);
    const newProduct = {
      id: generateId(),
      ...data,
      status: PRODUCT_STATUS.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(newProduct);
    return { ...newProduct };
  },

  async updateProduct(id, updates) {
    await delay(400);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    products[index] = { 
      ...products[index], 
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return { ...products[index] };
  },

  async deleteProduct(id) {
    await delay(400);
    products = products.filter(p => p.id !== id);
    return { success: true };
  }
};
