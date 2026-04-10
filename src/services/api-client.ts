import axios, { AxiosError } from 'axios';
import { getClientId } from '@src/utils/client-id';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers['X-Client-ID'] = getClientId();
  return config;
});

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Response Error:', {
        status: error.response.status,
        message:
          typeof error.response.data === 'object' &&
          error.response.data !== null
            ? (error.response.data as { message?: string }).message
            : 'Unknown error',
      });
    }
    return Promise.reject(error);
  }
);

export default api;
