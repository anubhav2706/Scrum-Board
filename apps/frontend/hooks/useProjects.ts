import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { IProject } from '../../../packages/types/index';

export function useProjects() {
  return useQuery<IProject[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get<IProject[]>('/projects');
      return data;
    },
  });
}