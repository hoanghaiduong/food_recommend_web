
import axios, { AxiosInstance, AxiosError } from 'axios';

// Default config
const API_BASE_URL = 'http://localhost:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Admin Key
api.interceptors.request.use(
  (config) => {
    const adminKey = localStorage.getItem('x-admin-key');
    if (adminKey) {
      config.headers['x-admin-key'] = adminKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Auth Errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear key and redirect to start
      console.warn('[API] Unauthorized. Clearing key and resetting...');
      localStorage.removeItem('x-admin-key');
      
      // Dispatch a custom event so the UI can react without page reload if desired,
      // or simply rely on the component checking localStorage.
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
