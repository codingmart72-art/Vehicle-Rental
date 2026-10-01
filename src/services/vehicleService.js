import apiClient from './apiClient';
import { mockBackend } from './mockBackend';

const USE_MOCK = true;

export const vehicleService = {
  searchVehicles: async (filters = {}) => {
    if (USE_MOCK) {
      const vehicles = await mockBackend.getVehicles();
      return vehicles.filter((v) => {
        if (filters.category && filters.category !== 'All' && v.category !== filters.category) return false;
        if (filters.type && filters.type !== 'All' && v.type !== filters.type) return false;
        if (filters.transmission && filters.transmission !== 'All' && v.transmission !== filters.transmission) return false;
        if (filters.minPrice && v.dailyRate < filters.minPrice) return false;
        if (filters.maxPrice && v.dailyRate > filters.maxPrice) return false;
        if (filters.search && !v.name.toLowerCase().includes(filters.search.toLowerCase()) && !v.brand.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
      });
    }
    const response = await apiClient.get('/vehicles/search', { params: filters });
    return response.data;
  },

  getVehicleDetails: async (id) => {
    if (USE_MOCK) {
      return await mockBackend.getVehicleDetails(id);
    }
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data;
  },

  checkVehicleAvailability: async (vehicleId, startDate, endDate) => {
    if (USE_MOCK) {
      const v = await mockBackend.getVehicleDetails(vehicleId);
      return { available: v.status === 'AVAILABLE', vehicle: v };
    }
    const response = await apiClient.get(`/vehicles/${vehicleId}/availability`, { params: { startDate, endDate } });
    return response.data;
  },

  createVehicle: async (vehicleData, ownerUser) => {
    if (USE_MOCK) {
      return await mockBackend.addVehicle(vehicleData, ownerUser);
    }
    const response = await apiClient.post('/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    if (USE_MOCK) {
      return await mockBackend.updateVehicle(id, vehicleData);
    }
    const response = await apiClient.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  getOwnerVehicles: async (ownerId) => {
    if (USE_MOCK) {
      const vehicles = await mockBackend.getVehicles();
      return vehicles.filter((v) => v.ownerId === ownerId);
    }
    const response = await apiClient.get(`/vehicles/owner/${ownerId}`);
    return response.data;
  },

  updateVehicleAvailability: async (id, status) => {
    if (USE_MOCK) {
      return await mockBackend.updateVehicle(id, { status });
    }
    const response = await apiClient.patch(`/vehicles/${id}/status`, { status });
    return response.data;
  }
};
