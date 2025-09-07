import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { CreateTicketDto, ITicket } from 'types';

export function useCreateTicket(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateTicketDto) => {
      const { data } = await api.post<ITicket>('/tickets', dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', projectId] });
    },
  });
} 