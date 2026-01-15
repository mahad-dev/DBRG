import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with professional configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication and common headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add Bearer token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add any additional common headers here
    config.headers['X-Requested-With'] = 'XMLHttpRequest';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for comprehensive error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status } = error.response;

      // Handle unauthorized access - clear token and redirect
      if (status === 401) {
        localStorage.removeItem('authToken');
        // Optional: redirect to login page
        // window.location.href = '/login';
      }

      // Preserve the original error with response data for parseApiError to handle
      return Promise.reject(error);
    } else if (error.request) {
      // Network error - no response received
      const networkError = new Error('Network error: Please check your internet connection');
      return Promise.reject(networkError);
    } else {
      // Request setup error
      const setupError = new Error(error.message || 'An unexpected error occurred');
      return Promise.reject(setupError);
    }
  }
);

export default apiClient;
