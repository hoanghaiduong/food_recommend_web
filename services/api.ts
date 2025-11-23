
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
      console.warn('[API] Unauthorized. Clearing key...');
      localStorage.removeItem('x-admin-key');
      // Dispatch event to notify SetupGuard to switch to Login
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

// --- Public API Instance (No Auth Interceptors) ---
// Used for status checks and initial handshakes
export const publicApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
