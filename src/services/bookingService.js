import apiClient from './apiClient';
import { mockBackend } from './mockBackend';

const USE_MOCK = true;

export const bookingService = {
  calculateBookingPreview: (dailyRate, startDate, endDate, offerDiscountPercent = 0) => {
    if (!startDate || !endDate) return { totalDays: 0, subtotal: 0, discountAmount: 0, finalPrice: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      return { totalDays: 0, subtotal: 0, discountAmount: 0, finalPrice: 0 };
    }
    const diffTime = end - start;
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const subtotal = totalDays * dailyRate;
    const discountAmount = Math.round((subtotal * offerDiscountPercent) / 100);
    const finalPrice = Math.max(0, subtotal - discountAmount);

    return { totalDays, subtotal, discountAmount, finalPrice };
  },

  createBooking: async (bookingData, user) => {
    if (USE_MOCK) {
      return await mockBackend.createBooking(bookingData, user);
    }
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async (user) => {
    if (USE_MOCK) {
      return await mockBackend.getBookings({ customerId: user.id });
    }
    const response = await apiClient.get('/bookings/my-bookings');
    return response.data;
  },

  getAllBookings: async () => {
    if (USE_MOCK) {
      return await mockBackend.getBookings({});
    }
    const response = await apiClient.get('/bookings/all');
    return response.data;
  },

  getRentalDetails: async (bookingId) => {
    if (USE_MOCK) {
      const bookings = await mockBackend.getBookings({});
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');
      return booking;
    }
    const response = await apiClient.get(`/rentals/${bookingId}`);
    return response.data;
  },
};
