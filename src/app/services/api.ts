import axios from 'axios';
import { showErrorGlobal } from '../context/ErrorContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Public client for login/register
export const publicClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Allow cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Private client for authenticated requests
export const privateClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Allow cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for errors
const setupInterceptors = (instance: any) => {
  instance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      const status = error.response?.status;
      const data = error.response?.data;
      const message = data?.error || 'An unexpected error occurred';

      // Global error handling for specific status codes
      if ([400, 403, 404, 409, 422].includes(status)) {
        showErrorGlobal(message, 'Action Failed');
      } else if (status === 401) {
        // Only show error for 401 if it's NOT a silent check or NOT the /auth/me call on mount
        // For now, let's let AuthContext handle 401 for /auth/me
        if (!error.config.url.includes('/auth/me')) {
          showErrorGlobal(message, 'Session Expired');
        }
      } else if (status >= 500) {
        // Don't show technical errors to user in detail, but show a generic one
        showErrorGlobal('Server is currently unavailable. Please try again later.', 'Server Error');
      }

      return Promise.reject(error);
    }
  );
};

setupInterceptors(publicClient);
setupInterceptors(privateClient);

export default privateClient;
