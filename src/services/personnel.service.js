import api from './api';
import { buildQueryString } from '../utils/helpers';

export const personnelService = {
  async getAll(params = {}) {
    const queryString = buildQueryString(params);
    const url = queryString ? `/personnel?${queryString}` : '/personnel';
    const response = await api.get(url);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/personnel/${id}`);
    return response.data;
  },

  async create(personnelData) {
    const response = await api.post('/personnel', personnelData);
    return response.data;
  },

  async update(id, personnelData) {
    const response = await api.put(`/personnel/${id}`, personnelData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/personnel/${id}`);
    return response.data;
  },

  async getSkills(id) {
    const response = await api.get(`/personnel/${id}/skills`);
    return response.data;
  },

  async assignSkill(id, skillData) {
    const response = await api.post(`/personnel/${id}/skills`, skillData);
    return response.data;
  },

  async updateSkill(personnelId, skillId, skillData) {
    const response = await api.put(`/personnel/${personnelId}/skills/${skillId}`, skillData);
    return response.data;
  },

  async removeSkill(personnelId, skillId) {
    const response = await api.delete(`/personnel/${personnelId}/skills/${skillId}`);
    return response.data;
  },
};

export default personnelService;

