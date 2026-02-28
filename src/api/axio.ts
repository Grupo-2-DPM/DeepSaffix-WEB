import axios from 'axios';
import { getActiveApiUrl } from './http';

const api = axios.create({ });

// Interceptor para la URL y el Token
api.interceptors.request.use((config) => {
  // 1. Seteamos la URL activa al momento de la petición
  config.baseURL = getActiveApiUrl();

  // 2. Inyectamos el Token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Interceptor para manejar errores globales (ej: 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
       localStorage.removeItem('token');
       // window.location.href = '/login'; // Opcional
    }
    return Promise.reject(error);
  }
);

export default api;