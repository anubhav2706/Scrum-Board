import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const { data } = await api.get('/users/profile');
      return data;
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: {
      name?: string;
      displayName?: string;
      email?: string;
      photoURL?: string;
      bio?: string;
      role?: string;
    }) => {
      const { data } = await api.put('/users/profile', profileData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

export const useInviteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (inviteData: { email: string; projectId?: string }) => {
      const { data } = await api.post('/users/invite', inviteData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useTeamMembers = (projectId?: string) => {
  return useQuery({
    queryKey: ['users', 'team', projectId],
    queryFn: async () => {
      const { data } = await api.get(`/users/team${projectId ? `?projectId=${projectId}` : ''}`);
      return data;
    },
  });
}; 