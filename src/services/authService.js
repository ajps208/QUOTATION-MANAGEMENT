import { USER_ROLES } from '@/constants/roles';

export const authService = {
  async login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid credentials');
    return data;
  },

  async register(formData) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async updateProfile(userId, updates) {
    const res = await fetch(`/api/auth/update/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');
    return data;
  },

  async changePassword(userId, currentPassword, newPassword) {
    // Placeholder — verify current password then update
    const res = await fetch(`/api/auth/update/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Password change failed');
    return { success: true };
  },
};
