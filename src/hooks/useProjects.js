import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { projectService } from '../services/project.service';
import { QUERY_KEYS } from '../utils/constants';

export const useProjects = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, params],
    queryFn: () => projectService.getAll(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useProjectDetail = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROJECT_DETAIL, id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });
};

// Alias for convenience
export const useProject = useProjectDetail;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      // Success message is handled in ProjectsPage.jsx with skill count
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to create project';
      toast.error(message);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => projectService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECT_DETAIL, variables.id] });
      toast.success('Project updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to update project';
      toast.error(message);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      toast.success('Project deleted successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to delete project';
      toast.error(message);
    },
  });
};

export const useAddRequiredSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, skillData }) =>
      projectService.addRequiredSkill(projectId, skillData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECT_DETAIL, variables.projectId] });
      toast.success('Required skill added successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to add required skill';
      toast.error(message);
    },
  });
};

export const useRemoveRequiredSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, skillId }) =>
      projectService.removeRequiredSkill(projectId, skillId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECT_DETAIL, variables.projectId] });
      toast.success('Required skill removed successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Failed to remove required skill';
      toast.error(message);
    },
  });
};

