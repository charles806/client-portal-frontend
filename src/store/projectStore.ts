import { create } from 'zustand';
import { projects as initialProjects, type Project } from '../app/data/mockData';

interface ProjectStore {
  projects: Project[];
  searchQuery: string;
  sortBy: 'name' | 'status' | 'progress' | 'dueDate';
  filterStatus: string;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'name' | 'status' | 'progress' | 'dueDate') => void;
  setFilterStatus: (status: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  filteredProjects: () => Project[];
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: initialProjects,
  searchQuery: '',
  sortBy: 'name',
  filterStatus: 'all',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setFilterStatus: (status) => set({ filterStatus: status }),

  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  })),

  filteredProjects: () => {
    const { projects, searchQuery, sortBy, filterStatus } = get();
    
    let filtered = projects;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'progress': return b.progress - a.progress;
        case 'dueDate': return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default: return 0;
      }
    });

    return filtered;
  }
}));