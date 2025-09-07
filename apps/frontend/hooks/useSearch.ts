import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export const useGlobalSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', 'global', query],
    queryFn: async () => {
      const { data } = await api.get(`/search/global?q=${encodeURIComponent(query)}`);
      return data;
    },
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProjectSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', 'projects', query],
    queryFn: async () => {
      const { data } = await api.get(`/search/projects?q=${encodeURIComponent(query)}`);
      return data;
    },
    enabled: query.length >= 2,
  });
};

export const useTicketSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', 'tickets', query],
    queryFn: async () => {
      const { data } = await api.get(`/search/tickets?q=${encodeURIComponent(query)}`);
      return data;
    },
    enabled: query.length >= 2,
  });
};

export const useUserSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', 'users', query],
    queryFn: async () => {
      const { data } = await api.get(`/search/users?q=${encodeURIComponent(query)}`);
      return data;
    },
    enabled: query.length >= 2,
  });
}; 