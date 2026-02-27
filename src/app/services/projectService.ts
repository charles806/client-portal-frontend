import { api } from './api';
import type { Project } from '../data/mockData';

export const projectService = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    const { data } = await api.get('/projects');
    return data;
  },

  // Get single project
  getProject: async (id: string): Promise<Project> => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },

  // Create project
  createProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    const { data } = await api.post('/projects', project);
    return data;
  },

  // Update project
  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    const { data } = await api.patch(`/projects/${id}`, updates);
    return data;
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};