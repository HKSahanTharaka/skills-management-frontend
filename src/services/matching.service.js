import api from './api';

export const matchingService = {
  async findMatchingPersonnel(projectId) {
    const response = await api.get(`/matching/project/${projectId}`);
    return response.data;
  },
};

export const availabilityService = {
  async getByPersonnelId(personnelId) {
    const response = await api.get(`/availability/${personnelId}`);
    return response.data;
  },

  async create(availabilityData) {
    const response = await api.post('/availability', availabilityData);
    return response.data;
  },

  async update(id, availabilityData) {
    const response = await api.put(`/availability/${id}`, availabilityData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/availability/${id}`);
    return response.data;
  },
};

export const allocationService = {
  async getByPersonnelId(personnelId) {
    const response = await api.get(`/allocations/personnel/${personnelId}`);
    return response.data;
  },

  async getByProjectId(projectId) {
    const response = await api.get(`/allocations/project/${projectId}`);
    return response.data;
  },

  async getPersonnelUtilization(personnelId) {
    const response = await api.get(`/allocations/personnel/${personnelId}/utilization`);
    return response.data;
  },

  async getTeamUtilization(months = 3) {
    const response = await api.get(`/allocations/team/utilization?months=${months}`);
    return response.data;
  },

  async create(allocationData) {
    const response = await api.post('/allocations', allocationData);
    return response.data;
  },

  async update(id, allocationData) {
    const response = await api.put(`/allocations/${id}`, allocationData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/allocations/${id}`);
    return response.data;
  },
};

export default {
  matching: matchingService,
  availability: availabilityService,
  allocation: allocationService,
};

