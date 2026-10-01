import axios from 'axios';

// Base API configuration following standard backend API path
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vrs_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Safe Error Handling & Token Expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 401 Unauthorized or 403 Forbidden: Automatic Session Handling
      if (error.response.status === 401) {
        localStorage.removeItem('vrs_auth_token');
        localStorage.removeItem('vrs_current_user');
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
      
      const safeMessage = error.response.data?.message || 'A server error occurred. Please try again.';
      return Promise.reject(new Error(safeMessage));
    } else if (error.request) {
      return Promise.reject(new Error('Network error. Unable to reach backend service.'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
