import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hook to get authenticated API client
export function useApi() {
  const { getToken } = useAuth();

  const authenticatedClient = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to every request
  authenticatedClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    get: <T>(endpoint: string) =>
      authenticatedClient.get<T>(endpoint).then((res) => res.data),
    post: <T>(endpoint: string, body: unknown) =>
      authenticatedClient.post<T>(endpoint, body).then((res) => res.data),
    put: <T>(endpoint: string, body: unknown) =>
      authenticatedClient.put<T>(endpoint, body).then((res) => res.data),
    patch: <T>(endpoint: string, body: unknown) =>
      authenticatedClient.patch<T>(endpoint, body).then((res) => res.data),
    delete: <T>(endpoint: string) =>
      authenticatedClient.delete<T>(endpoint).then((res) => res.data),
  };
}

export default apiClient;