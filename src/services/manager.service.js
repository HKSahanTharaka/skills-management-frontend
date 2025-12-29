import api from './api';

export const managerService = {
  getAll: async (params = {}) => {
    const response = await api.get('/managers', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/managers/${id}`);
    return response.data;
  },

  approve: async (id) => {
    const response = await api.put(`/managers/${id}/approve`);
    return response.data;
  },

  reject: async (id) => {
    const response = await api.put(`/managers/${id}/reject`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/managers/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/managers/stats');
    return response.data;
  },
};

