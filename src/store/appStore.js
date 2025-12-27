import { create } from 'zustand';

export const useAppStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  filters: {},
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
}));

export default useAppStore;

