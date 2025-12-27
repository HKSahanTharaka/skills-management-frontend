import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { personnelService } from '../services/personnel.service';
import { QUERY_KEYS } from '../utils/constants';

export const usePersonnel = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PERSONNEL, params],
    queryFn: () => personnelService.getAll(params),
  });
};

export const usePersonnelDetail = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PERSONNEL_DETAIL, id],
    queryFn: () => personnelService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePersonnel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: personnelService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PERSONNEL] });
      toast.success('Personnel created successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to create personnel';
      toast.error(message);
    },
  });
};

export const useUpdatePersonnel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => personnelService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PERSONNEL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PERSONNEL_DETAIL, variables.id] });
      toast.success('Personnel updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to update personnel';
      toast.error(message);
    },
  });
};

export const useDeletePersonnel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: personnelService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PERSONNEL] });
      toast.success('Personnel deleted successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to delete personnel';
      toast.error(message);
    },
  });
};

export const useAssignSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ personnelId, skillData }) =>
      personnelService.assignSkill(personnelId, skillData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PERSONNEL_DETAIL, variables.personnelId] });
      toast.success('Skill assigned successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to assign skill';
      toast.error(message);
    },
  });
};

export const useRemoveSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ personnelId, skillId }) =>
      personnelService.removeSkill(personnelId, skillId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PERSONNEL_DETAIL, variables.personnelId] });
      toast.success('Skill removed successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to remove skill';
      toast.error(message);
    },
  });
};

