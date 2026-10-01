import apiClient from './apiClient';
import { mockBackend } from './mockBackend';

const USE_MOCK = true;

export const licenseService = {
  uploadDrivingLicense: async (userId, licenseData) => {
    if (USE_MOCK) {
      return await mockBackend.uploadLicense(userId, licenseData);
    }
    const response = await apiClient.post('/licenses/upload', { userId, ...licenseData });
    return response.data;
  },

  getLicenseStatus: async (userId) => {
    if (USE_MOCK) {
      return await mockBackend.getLicenseStatus(userId);
    }
    const response = await apiClient.get(`/licenses/status/${userId}`);
    return response.data;
  },

  getAllLicenses: async () => {
    if (USE_MOCK) {
      return await mockBackend.getAllLicenses();
    }
    const response = await apiClient.get('/licenses/all');
    return response.data;
  },

  getLicenseVerificationQueue: async () => {
    if (USE_MOCK) {
      return await mockBackend.getLicenseQueue();
    }
    const response = await apiClient.get('/licenses/queue');
    return response.data;
  },

  verifyLicense: async (licenseId, decision, staffUser, notes) => {
    if (USE_MOCK) {
      return await mockBackend.verifyLicense(licenseId, decision, staffUser, notes);
    }
    const response = await apiClient.post(`/licenses/${licenseId}/verify`, { decision, notes });
    return response.data;
  },
};
