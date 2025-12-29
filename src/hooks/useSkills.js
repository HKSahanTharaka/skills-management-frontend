import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { skillService } from '../services/skill.service';
import { QUERY_KEYS } from '../utils/constants';

export const useSkills = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SKILLS, params],
    queryFn: () => skillService.getAll(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useSkillDetail = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SKILL_DETAIL, id],
    queryFn: () => skillService.getById(id),
    enabled: !!id,
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILLS] });
      toast.success('Skill created successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to create skill';
      toast.error(message);
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => skillService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILLS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILL_DETAIL, variables.id] });
      toast.success('Skill updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to update skill';
      toast.error(message);
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILLS] });
      toast.success('Skill deleted successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to delete skill';
      toast.error(message);
    },
  });
};

