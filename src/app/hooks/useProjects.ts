import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { toast } from 'sonner';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  client: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  priority: 'low' | 'medium' | 'high';
  budget: number;
  spent: number;
  progress: number;
  startDate: string;
  dueDate: string;
  endDate?: string | null;
  workspaceId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  dueDate: string;
  status: 'pending' | 'completed';
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useProjects(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['workspaces', workspaceId, 'projects'],
    queryFn: async () => {
      const response = await apiClient.get(`/projects?workspaceId=${workspaceId}`);
      return response.data;
    },
    enabled: !!workspaceId,
  });

  const createProject = useMutation({
    mutationFn: async (data: Partial<Project> & { workspaceId: string }) => {
      const response = await apiClient.post('/projects', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'projects'] });
      toast.success('Project created!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create project');
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Project> }) => {
      const response = await apiClient.patch(`/projects/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'projects'] });
      toast.success('Project updated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update project');
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/projects/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'projects'] });
      toast.success('Project deleted!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete project');
    },
  });

  const stats = {
    total: projects.length,
    active: projects.filter((p: { status: string; }) => p.status === 'active').length,
    completed: projects.filter((p: { status: string; }) => p.status === 'completed').length,
    onHold: projects.filter((p: { status: string; }) => p.status === 'on-hold').length,
    totalBudget: projects.reduce((acc: any, p: { budget: any; }) => acc + p.budget, 0),
    totalSpent: projects.reduce((acc: any, p: { spent: any; }) => acc + p.spent, 0),
    avgProgress: projects.length
      ? Math.round(projects.reduce((acc: any, p: { progress: any; }) => acc + p.progress, 0) / projects.length)
      : 0,
  };

  return {
    projects,
    isLoading,
    stats,
    createProject: createProject.mutateAsync,
    updateProject: updateProject.mutateAsync,
    deleteProject: deleteProject.mutateAsync,
  };
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useMilestones(projectId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ['projects', projectId, 'milestones'],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${projectId}/milestones`);
      return response.data;
    },
    enabled: !!projectId,
  });

  const createMilestone = useMutation({
    mutationFn: async (data: Partial<Milestone>) => {
      const response = await apiClient.post(`/projects/${projectId}/milestones`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'milestones'] });
      toast.success('Milestone created!');
    },
  });

  const updateMilestone = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Milestone> }) => {
      const response = await apiClient.patch(`/milestones/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'milestones'] });
      toast.success('Milestone updated!');
    },
  });

  const deleteMilestone = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/milestones/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'milestones'] });
      toast.success('Milestone deleted!');
    },
  });

  return {
    milestones,
    isLoading,
    createMilestone: createMilestone.mutateAsync,
    updateMilestone: updateMilestone.mutateAsync,
    deleteMilestone: deleteMilestone.mutateAsync,
  };
}