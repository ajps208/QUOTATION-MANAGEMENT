import { mockUsers } from '@/data/mock';
import { generateId } from '@/utils/helpers';
import { USER_ROLES } from '@/constants/roles';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email, password) {
    await delay(300);
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async register(data) {
    await delay(500);
    const existing = mockUsers.find(u => u.email === data.email);
    if (existing) throw new Error('Email already exists');

    const newUser = {
      id: generateId(),
      ...data,
      role: data.role || USER_ROLES.CUSTOMER,
      avatar: data.name ? data.name.substring(0, 2).toUpperCase() : 'U',
    };
    
    // In a real app we'd save to DB here. For mock, we just return it.
    // mockUsers.push(newUser); // Optional: mutate array for session
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async updateProfile(userId, updates) {
    await delay(400);
    // Real implementation would update DB
    return { id: userId, ...updates };
  },

  async changePassword(userId, currentPassword, newPassword) {
    await delay(400);
    return { success: true };
  }
};
