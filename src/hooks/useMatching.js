import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { matchingService, availabilityService, allocationService } from '../services/matching.service';
import { QUERY_KEYS } from '../utils/constants';

export const useMatchPersonnel = (projectId, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MATCHING, projectId],
    queryFn: async () => {
      const result = await matchingService.findMatchingPersonnel(projectId);
      return result;
    },
    enabled: options.enabled !== undefined ? options.enabled : !!projectId,
  });
};

export const useAvailability = (personnelId, dateRange = {}, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.AVAILABILITY, personnelId, dateRange],
    queryFn: async () => {
      const result = await availabilityService.getByPersonnelId(personnelId);
      return result.availability || [];
    },
    enabled: options.enabled !== undefined ? options.enabled : !!personnelId,
  });
};

export const useCreateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => availabilityService.create({
      personnel_id: data.personnelId,
      start_date: data.startDate,
      end_date: data.endDate,
      availability_percentage: data.availabilityPercentage,
      notes: data.notes || '',
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVAILABILITY] });
      toast.success('Availability period created');
    },
    onError: (error) => {
      const errorData = error.response?.data?.error;
      const message = errorData?.message || 'Failed to create availability';
      const hint = errorData?.hint;
      
      toast.error(message, { duration: 4000 });
      if (hint) {
        toast(hint, { 
          duration: 5000,
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        });
      }
    },
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => availabilityService.update(data.id, {
      start_date: data.startDate,
      end_date: data.endDate,
      availability_percentage: data.availabilityPercentage,
      notes: data.notes || '',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVAILABILITY] });
      toast.success('Availability updated');
    },
    onError: (error) => {
      const errorData = error.response?.data?.error;
      const message = errorData?.message || 'Failed to update availability';
      const hint = errorData?.hint;
      
      toast.error(message, { duration: 4000 });
      if (hint) {
        toast(hint, { 
          duration: 5000,
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        });
      }
    },
  });
};

export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: availabilityService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVAILABILITY] });
      toast.success('Availability period deleted');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to delete availability';
      toast.error(message);
    },
  });
};

export const usePersonnelAllocations = (personnelId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALLOCATIONS, 'personnel', personnelId],
    queryFn: async () => {
      const result = await allocationService.getByPersonnelId(personnelId);
      return result.allocations || [];
    },
    enabled: !!personnelId,
  });
};

export const useProjectAllocations = (projectId, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALLOCATIONS, 'project', projectId],
    queryFn: async () => {
      const result = await allocationService.getByProjectId(projectId);
      return result.allocations || [];
    },
    enabled: options.enabled !== undefined ? options.enabled : !!projectId,
  });
};

export const usePersonnelUtilization = (personnelId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALLOCATIONS, 'utilization', personnelId],
    queryFn: async () => {
      const result = await allocationService.getPersonnelUtilization(personnelId);
      return result;
    },
    enabled: !!personnelId,
  });
};

export const useAllocateToProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, personnelId, allocationPercentage, startDate, endDate, roleInProject }) => {
      const projectResponse = queryClient.getQueryData([QUERY_KEYS.PROJECT_DETAIL, projectId]);
      const project = projectResponse?.data;
      
      return allocationService.create({
        project_id: projectId,
        personnel_id: personnelId,
        allocation_percentage: allocationPercentage || 100,
        start_date: startDate || project?.start_date || new Date().toISOString().split('T')[0],
        end_date: endDate || project?.end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        role_in_project: roleInProject || 'Team Member',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALLOCATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MATCHING] });
      toast.success('Personnel allocated to project successfully');
    },
    onError: (error) => {
      const errorData = error.response?.data?.error;
      const message = errorData?.message || 'Failed to allocate personnel';
      const hint = errorData?.hint;
      
      toast.error(message, { duration: 5000 });
      if (hint) {
        toast(hint, { 
          duration: 6000,
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        });
      }
    },
  });
};

export const useCreateAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: allocationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALLOCATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      toast.success('Personnel allocated successfully');
    },
    onError: (error) => {
      const errorData = error.response?.data?.error;
      const message = errorData?.message || 'Failed to create allocation';
      const hint = errorData?.hint;
      
      toast.error(message, { duration: 5000 });
      if (hint) {
        toast(hint, { 
          duration: 6000,
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        });
      }
    },
  });
};

export const useUpdateAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => allocationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALLOCATIONS] });
      toast.success('Allocation updated');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to update allocation';
      toast.error(message);
    },
  });
};

export const useDeleteAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: allocationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALLOCATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MATCHING] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      toast.success('Personnel unassigned from project successfully');
    },
    onError: (error) => {
      const errorData = error.response?.data?.error;
      const message = errorData?.message || 'Failed to unassign personnel';
      const hint = errorData?.hint;
      
      toast.error(message, { duration: 4000 });
      if (hint) {
        toast(hint, { 
          duration: 5000,
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        });
      }
    },
  });
};

