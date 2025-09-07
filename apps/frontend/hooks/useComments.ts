import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { IComment } from 'types';

export function useComments(ticketId: string) {
  return useQuery<IComment[]>({
    queryKey: ['comments', ticketId],
    queryFn: async () => {
      const { data } = await api.get<IComment[]>(`/tickets/${ticketId}/comments`);
      return data;
    },
    enabled: !!ticketId,
  });
} 