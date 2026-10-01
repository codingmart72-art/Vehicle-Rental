import apiClient from './apiClient';
import { mockBackend } from './mockBackend';

const USE_MOCK = true; // Easily toggled when backend server is running

export const authService = {
  authenticateUser: async (email, password) => {
    if (USE_MOCK) {
      return await mockBackend.login(email, password);
    }
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  registerCustomer: async (userData) => {
    if (USE_MOCK) {
      return await mockBackend.register(userData);
    }
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const userStr = localStorage.getItem('vrs_current_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  logoutUser: () => {
    localStorage.removeItem('vrs_auth_token');
    localStorage.removeItem('vrs_current_user');
  },
};
