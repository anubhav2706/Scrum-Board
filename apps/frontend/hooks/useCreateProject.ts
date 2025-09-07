import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { CreateProjectDto, IProject } from 'types';

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateProjectDto) => {
      const { data } = await api.post<IProject>('/projects', dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
} 