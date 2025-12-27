import api from './api';
import { buildQueryString } from '../utils/helpers';

export const projectService = {
  async getAll(params = {}) {
    const queryString = buildQueryString(params);
    const url = queryString ? `/projects?${queryString}` : '/projects';
    const response = await api.get(url);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async create(projectData) {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  async update(id, projectData) {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  async addRequiredSkill(id, skillData) {
    const response = await api.post(`/projects/${id}/required-skills`, skillData);
    return response.data;
  },

  async updateRequiredSkill(projectId, skillId, skillData) {
    const response = await api.put(`/projects/${projectId}/skills/${skillId}`, skillData);
    return response.data;
  },

  async removeRequiredSkill(projectId, skillId) {
    const response = await api.delete(`/projects/${projectId}/skills/${skillId}`);
    return response.data;
  },
};

export default projectService;

