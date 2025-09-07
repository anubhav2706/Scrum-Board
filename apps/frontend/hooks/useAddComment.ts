import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { IComment } from 'types';

export function useAddComment(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { message: string }) => {
      const { data } = await api.post<IComment>(`/tickets/${ticketId}/comments`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
    },
  });
} 