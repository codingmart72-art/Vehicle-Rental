import apiClient from './apiClient';
import { mockBackend } from './mockBackend';

const USE_MOCK = true;

export const inspectionService = {
  submitPickupInspection: async (inspectionData, staffUser) => {
    if (USE_MOCK) {
      return await mockBackend.submitPickupInspection(inspectionData, staffUser);
    }
    const response = await apiClient.post('/inspections/pickup', inspectionData);
    return response.data;
  },

  submitReturnInspection: async (inspectionData, staffUser) => {
    if (USE_MOCK) {
      return await mockBackend.submitReturnInspection(inspectionData, staffUser);
    }
    const response = await apiClient.post('/inspections/return', inspectionData);
    return response.data;
  },

  getPickupInspection: async (bookingId) => {
    if (USE_MOCK) {
      return await mockBackend.getPickupInspection(bookingId);
    }
    const response = await apiClient.get(`/inspections/pickup/${bookingId}`);
    return response.data;
  },

  getDamageReports: async () => {
    if (USE_MOCK) {
      return await mockBackend.getDamageReports();
    }
    const response = await apiClient.get('/damage-reports');
    return response.data;
  }
};
