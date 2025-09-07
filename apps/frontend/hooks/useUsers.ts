import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { IUser } from 'types';

export function useUsers() {
  return useQuery<IUser[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<IUser[]>('/users');
      return data;
    },
  });
} 