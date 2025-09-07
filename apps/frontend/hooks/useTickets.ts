import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { ITicket } from 'types';

export function useTickets(projectId: string) {
  return useQuery<ITicket[]>({
    queryKey: ['tickets', projectId],
    queryFn: async () => {
      const { data } = await api.get<ITicket[]>(`/tickets?projectId=${projectId}`);
      return data;
    },
    enabled: !!projectId,
  });
} 