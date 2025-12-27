import { create } from 'zustand';
import { authService } from '../services/auth.service';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    
    set({
      token,
      user,
      isAuthenticated: !!token,
      isLoading: false,
    });
  },

  login: (token, user) => {
    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    authService.logout();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => {
    set({ user });
  },
}));

export default useAuthStore;

