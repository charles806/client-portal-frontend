import api from './api';
import type { Project, Milestone } from '../store/projectStore';

export const projectService = {
  getProjects: () => api.get<Project[]>('/projects'),
  getProject: (id: string) => api.get<Project>(`/projects/${id}`),
  createProject: (data: Partial<Project>) => api.post<Project>('/projects', data),
  updateProject: (id: string, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  deleteProject: (id: string) => api.delete<void>(`/projects/${id}`),
  addMilestone: (projectId: string, data: Partial<Milestone>) =>
    api.post<Milestone>(`/projects/${projectId}/milestones`, data),
  toggleMilestone: (projectId: string, milestoneId: string) =>
    api.patch<Milestone>(`/projects/${projectId}/milestones/${milestoneId}/toggle`, {}),
};


export default projectService;