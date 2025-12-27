import api from './api';
import { buildQueryString } from '../utils/helpers';

export const skillService = {
  async getAll(params = {}) {
    const queryString = buildQueryString(params);
    const url = queryString ? `/skills?${queryString}` : '/skills';
    const response = await api.get(url);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/skills/${id}`);
    return response.data;
  },

  async create(skillData) {
    const response = await api.post('/skills', skillData);
    return response.data;
  },

  async update(id, skillData) {
    const response = await api.put(`/skills/${id}`, skillData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },
};

export default skillService;

