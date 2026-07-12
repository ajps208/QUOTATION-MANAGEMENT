import { mockCategories } from '@/data/mock';
import { generateId } from '@/utils/helpers';
import { CATEGORY_STATUS } from '@/constants/statuses';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let categories = [...mockCategories];

export const categoryService = {
  async getCategories(businessId) {
    await delay(300);
    return categories.filter(c => c.businessId === businessId);
  },

  async getCategoryById(id) {
    await delay(300);
    const category = categories.find(c => c.id === id);
    if (!category) throw new Error('Category not found');
    return { ...category };
  },

  async createCategory(data) {
    await delay(400);
    const newCategory = {
      id: generateId(),
      ...data,
      status: CATEGORY_STATUS.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async updateCategory(id, updates) {
    await delay(400);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    categories[index] = { 
      ...categories[index], 
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return { ...categories[index] };
  },

  async deleteCategory(id) {
    await delay(400);
    categories = categories.filter(c => c.id !== id);
    return { success: true };
  }
};
