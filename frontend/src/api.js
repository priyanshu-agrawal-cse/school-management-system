import axios from 'axios';

// Reads from VITE_API_URL env variable (set in Vercel dashboard or .env.production)
// Fallback to localhost for local development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api100b';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
