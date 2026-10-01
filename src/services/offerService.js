import apiClient from './apiClient';
import { mockBackend } from './mockBackend';

const USE_MOCK = true;

export const offerService = {
  getFestivalOffers: async () => {
    if (USE_MOCK) return await mockBackend.getOffers();
    const response = await apiClient.get('/offers');
    return response.data;
  },

  createOffer: async (offerData, adminUser) => {
    if (USE_MOCK) return await mockBackend.createOffer(offerData, adminUser);
    const response = await apiClient.post('/offers', offerData);
    return response.data;
  }
};
