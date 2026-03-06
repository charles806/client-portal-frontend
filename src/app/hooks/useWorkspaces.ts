import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { toast } from 'sonner';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    projects: number;
    members: number;
  };
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  user?: {
    id: string;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
}

export function useWorkspaces(options: { enabled?: boolean } = { enabled: true }) {
  const queryClient = useQueryClient();

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await apiClient.get('/workspaces');
      return response.data;
    },
    enabled: options.enabled,
  });

  const createWorkspace = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await apiClient.post('/workspaces', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace created!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create workspace');
    },
  });

  return {
    workspaces,
    isLoading,
    createWorkspace: createWorkspace.mutateAsync,
  };
}

export function useWorkspace(id: string | undefined) {
  return useQuery({
    queryKey: ['workspaces', id],
    queryFn: async () => {
      const response = await apiClient.get(`/workspaces/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useWorkspaceMembers(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['workspaces', workspaceId, 'members'],
    queryFn: async () => {
      const response = await apiClient.get(`/workspaces/${workspaceId}/members`);
      return response.data;
    },
    enabled: !!workspaceId,
  });

  const inviteMember = useMutation({
    mutationFn: async (data: { email: string; role: 'admin' | 'member' }) => {
      const response = await apiClient.post(`/workspaces/${workspaceId}/members`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] });
      toast.success('Member invited!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to invite member');
    },
  });

  const updateMemberRole = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: 'admin' | 'member' }) => {
      const response = await apiClient.patch(`/workspaces/${workspaceId}/members/${memberId}`, { role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] });
      toast.success('Role updated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update role');
    },
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await apiClient.delete(`/workspaces/${workspaceId}/members/${memberId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] });
      toast.success('Member removed!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to remove member');
    },
  });

  return {
    members,
    isLoading,
    inviteMember: inviteMember.mutateAsync,
    updateMemberRole: updateMemberRole.mutateAsync,
    removeMember: removeMember.mutateAsync,
  };
}