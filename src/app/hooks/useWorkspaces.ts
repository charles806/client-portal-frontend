import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../services/api';
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
    firstName: string;
    lastName: string;
    emailAddress: string;
    imageUrl: string;
  };
}

export function useWorkspaces() {
  const api = useApi();
  const queryClient = useQueryClient();

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => api.get<Workspace[]>('/workspaces'),
  });

  const createWorkspace = useMutation({
    mutationFn: (data: { name: string }) => api.post<Workspace>('/workspaces', data),
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
  const api = useApi();

  return useQuery({
    queryKey: ['workspaces', id],
    queryFn: () => api.get<Workspace>(`/workspaces/${id}`),
    enabled: !!id,
  });
}

export function useWorkspaceMembers(workspaceId: string | undefined) {
  const api = useApi();
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['workspaces', workspaceId, 'members'],
    queryFn: () => api.get<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`),
    enabled: !!workspaceId,
  });

  const inviteMember = useMutation({
    mutationFn: (data: { email: string; role: 'admin' | 'member' }) =>
      api.post(`/workspaces/${workspaceId}/members`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] });
      toast.success('Member invited!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to invite member');
    },
  });

  const updateMemberRole = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: 'admin' | 'member' }) =>
      api.patch(`/workspaces/${workspaceId}/members/${memberId}`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] });
      toast.success('Role updated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update role');
    },
  });

  const removeMember = useMutation({
    mutationFn: (memberId: string) =>
      api.delete(`/workspaces/${workspaceId}/members/${memberId}`),
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