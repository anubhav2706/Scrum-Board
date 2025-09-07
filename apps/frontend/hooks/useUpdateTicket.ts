import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { ITicket } from 'types';

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticket: Partial<ITicket> & { id: string }) => {
      const { data } = await api.patch<ITicket>(`/tickets/${ticket.id}`, ticket);
      return data;
    },
    onSuccess: (updated) => {
      // Update tickets cache for the project
      queryClient.setQueryData<ITicket[]>(['tickets', updated.projectId], (old) =>
        old ? old.map(t => t.id === updated.id ? updated : t) : []
      );
    },
  });
} 