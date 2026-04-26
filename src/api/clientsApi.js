import axios from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables";


const { VITE_API_URL1 } = getEnvVariables();

const clientsApi = axios.create({
    baseURL: import.meta.env.PROD ? '/api' : (VITE_API_URL1 || 'http://localhost:4001')
});

// Interceptor de peticion: anade token a cada request
clientsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-token'] = token;
  return config;
});

// Interceptor de respuesta: redirige a login si el token ha expirado
clientsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthRoute = url.replace(/^\//, '').startsWith('auth/');
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('token-init-date');
      window.location.replace('/auth/login');
    }
    return Promise.reject(error);
  }
);


export default clientsApi;
