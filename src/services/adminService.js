import apiClient from './apiClient';
import { mockBackend } from './mockBackend';

const USE_MOCK = true;

export const adminService = {
  getUsers: async () => {
    if (USE_MOCK) return await mockBackend.getUsers();
    const response = await apiClient.get('/users');
    return response.data;
  },

  updateUserStatus: async (userId, newStatus, adminUser) => {
    if (USE_MOCK) return await mockBackend.updateUserStatus(userId, newStatus, adminUser);
    const response = await apiClient.patch(`/users/${userId}/status`, { status: newStatus });
    return response.data;
  },

  assignRole: async (userId, newRole, adminUser) => {
    if (USE_MOCK) return await mockBackend.updateUserRole(userId, newRole, adminUser);
    const response = await apiClient.patch(`/users/${userId}/role`, { role: newRole });
    return response.data;
  },

  getAuditLogs: async () => {
    if (USE_MOCK) return await mockBackend.getAuditLogs();
    const response = await apiClient.get('/audit-logs');
    return response.data;
  },

  getSecurityEvents: async () => {
    if (USE_MOCK) return await mockBackend.getSecurityEvents();
    const response = await apiClient.get('/security-events');
    return response.data;
  },
};
