import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      if (status === 403) {
        console.error('Access forbidden');
      }
      
      if (status === 500) {
        console.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      console.error('No response from server. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;

