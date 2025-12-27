import api from './api';
import { AUTH_TOKEN_KEY } from '../utils/constants';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    
    return { token, user };
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  },

  getCurrentUser() {
    const token = this.getToken();
    
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },
};

export default authService;

