import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed';

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
  startDate: string;
  client: string;
  budget: number;
  spent: number;
  team: TeamMember[];
  tags: string[];
  createdAt: string;
  milestones: Milestone[];
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'milestones'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  addMilestone: (projectId: string, milestone: Omit<Milestone, 'id' | 'projectId'>) => void;
  setProjects: (projects: Project[]) => void;
}

const defaultTeam: TeamMember[] = [
  { id: 't1', name: 'Sarah Chen', avatar: 'SC', role: 'Lead Developer' },
  { id: 't2', name: 'Marcus Reid', avatar: 'MR', role: 'Designer' },
  { id: 't3', name: 'Priya Patel', avatar: 'PP', role: 'Product Manager' },
  { id: 't4', name: 'James Wu', avatar: 'JW', role: 'Backend Engineer' },
];

const seedProjects: Project[] = [
  {
    id: 'p1',
    name: 'Client Portal Redesign',
    description: 'Complete redesign of the client-facing portal with modern UI/UX patterns and improved accessibility.',
    status: 'active',
    progress: 72,
    dueDate: '2026-04-15',
    startDate: '2026-01-10',
    client: 'Acme Corp',
    budget: 45000,
    spent: 32400,
    team: [defaultTeam[0], defaultTeam[1], defaultTeam[2]],
    tags: ['Design', 'Frontend', 'UX'],
    createdAt: '2026-01-10T09:00:00Z',
    milestones: [
      { id: 'm1', projectId: 'p1', title: 'Discovery & Research', description: 'User interviews and competitive analysis', dueDate: '2026-01-31', completed: true, completedAt: '2026-01-29T16:00:00Z' },
      { id: 'm2', projectId: 'p1', title: 'Wireframes & Prototypes', description: 'Low and high-fidelity wireframes', dueDate: '2026-02-28', completed: true, completedAt: '2026-02-25T14:00:00Z' },
      { id: 'm3', projectId: 'p1', title: 'Frontend Development', description: 'Implement approved designs', dueDate: '2026-03-31', completed: false },
      { id: 'm4', projectId: 'p1', title: 'QA & Testing', description: 'Cross-browser testing and bug fixes', dueDate: '2026-04-10', completed: false },
      { id: 'm5', projectId: 'p1', title: 'Launch', description: 'Production deployment and handoff', dueDate: '2026-04-15', completed: false },
    ],
  },
  {
    id: 'p2',
    name: 'Data Analytics Platform',
    description: 'Build a real-time analytics dashboard for business intelligence with customizable widgets.',
    status: 'active',
    progress: 45,
    dueDate: '2026-05-30',
    startDate: '2026-02-01',
    client: 'TechFlow Inc',
    budget: 78000,
    spent: 35100,
    team: [defaultTeam[0], defaultTeam[3]],
    tags: ['Analytics', 'Backend', 'API'],
    createdAt: '2026-02-01T09:00:00Z',
    milestones: [
      { id: 'm6', projectId: 'p2', title: 'Architecture Design', description: 'System design and tech stack selection', dueDate: '2026-02-15', completed: true, completedAt: '2026-02-14T11:00:00Z' },
      { id: 'm7', projectId: 'p2', title: 'API Development', description: 'RESTful API and data pipeline', dueDate: '2026-03-30', completed: false },
      { id: 'm8', projectId: 'p2', title: 'Dashboard UI', description: 'Interactive charts and widgets', dueDate: '2026-04-30', completed: false },
      { id: 'm9', projectId: 'p2', title: 'Integration & Testing', description: 'End-to-end integration testing', dueDate: '2026-05-20', completed: false },
    ],
  },
  {
    id: 'p3',
    name: 'Mobile App — iOS & Android',
    description: 'Cross-platform mobile application for field service management with offline capabilities.',
    status: 'planning',
    progress: 12,
    dueDate: '2026-07-31',
    startDate: '2026-03-01',
    client: 'ServicePro Ltd',
    budget: 120000,
    spent: 14400,
    team: [defaultTeam[1], defaultTeam[2], defaultTeam[3]],
    tags: ['Mobile', 'React Native', 'Offline'],
    createdAt: '2026-02-15T09:00:00Z',
    milestones: [
      { id: 'm10', projectId: 'p3', title: 'Requirements Gathering', description: 'Stakeholder interviews and spec doc', dueDate: '2026-03-15', completed: true, completedAt: '2026-03-12T10:00:00Z' },
      { id: 'm11', projectId: 'p3', title: 'UI/UX Design', description: 'Mobile design system and screens', dueDate: '2026-04-15', completed: false },
      { id: 'm12', projectId: 'p3', title: 'MVP Development', description: 'Core feature implementation', dueDate: '2026-06-15', completed: false },
      { id: 'm13', projectId: 'p3', title: 'Beta Testing', description: 'TestFlight and Play Store beta', dueDate: '2026-07-15', completed: false },
    ],
  },
  {
    id: 'p4',
    name: 'E-Commerce Migration',
    description: 'Migrate legacy e-commerce platform to headless architecture with improved performance.',
    status: 'completed',
    progress: 100,
    dueDate: '2026-02-28',
    startDate: '2025-11-01',
    client: 'RetailBrand Co',
    budget: 55000,
    spent: 52300,
    team: [defaultTeam[0], defaultTeam[2]],
    tags: ['E-Commerce', 'Migration', 'Performance'],
    createdAt: '2025-11-01T09:00:00Z',
    milestones: [
      { id: 'm14', projectId: 'p4', title: 'Audit & Planning', description: 'Legacy system audit', dueDate: '2025-11-30', completed: true, completedAt: '2025-11-28T15:00:00Z' },
      { id: 'm15', projectId: 'p4', title: 'Data Migration', description: 'Product and order data migration', dueDate: '2025-12-31', completed: true, completedAt: '2025-12-29T12:00:00Z' },
      { id: 'm16', projectId: 'p4', title: 'Frontend Rebuild', description: 'Headless storefront implementation', dueDate: '2026-02-15', completed: true, completedAt: '2026-02-12T17:00:00Z' },
      { id: 'm17', projectId: 'p4', title: 'Launch & Handoff', description: 'Production go-live', dueDate: '2026-02-28', completed: true, completedAt: '2026-02-26T09:00:00Z' },
    ],
  },
  {
    id: 'p5',
    name: 'Internal HR System',
    description: 'Custom HR management system with payroll integration, leave tracking, and performance reviews.',
    status: 'on-hold',
    progress: 38,
    dueDate: '2026-06-30',
    startDate: '2026-01-15',
    client: 'Global Dynamics',
    budget: 65000,
    spent: 24700,
    team: [defaultTeam[1], defaultTeam[3]],
    tags: ['HR', 'SaaS', 'Integration'],
    createdAt: '2026-01-15T09:00:00Z',
    milestones: [
      { id: 'm18', projectId: 'p5', title: 'System Architecture', description: 'Database schema and API design', dueDate: '2026-02-01', completed: true, completedAt: '2026-01-30T13:00:00Z' },
      { id: 'm19', projectId: 'p5', title: 'Core Modules', description: 'Employee and leave management', dueDate: '2026-03-31', completed: false },
      { id: 'm20', projectId: 'p5', title: 'Payroll Integration', description: 'Third-party payroll API integration', dueDate: '2026-05-31', completed: false },
    ],
  },
];

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: seedProjects,
      loading: false,
      setProjects: (projects) => set({ projects }),
      addProject: (projectData) => {
        const project: Project = {
          ...projectData,
          id: `p${Date.now()}`,
          createdAt: new Date().toISOString(),
          milestones: [],
        };
        set((state) => ({ projects: [project, ...state.projects] }));
      },
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },
      deleteProject: (id) => {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
      },
      toggleMilestone: (projectId, milestoneId) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            const milestones = p.milestones.map((m) =>
              m.id === milestoneId
                ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
                : m
            );
            const completed = milestones.filter((m) => m.completed).length;
            const progress = Math.round((completed / milestones.length) * 100);
            return { ...p, milestones, progress };
          }),
        }));
      },
      addMilestone: (projectId, milestone) => {
        const newMilestone: Milestone = {
          ...milestone,
          id: `m${Date.now()}`,
          projectId,
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, milestones: [...p.milestones, newMilestone] } : p
          ),
        }));
      },
    }),
    { name: 'saas-projects' }
  )
);
