import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar: string;
  joinedAt: string;
  status: 'active' | 'invited';
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'pro' | 'enterprise';
  logo?: string;
  members: WorkspaceMember[];
  createdAt: string;
  industry: string;
  website: string;
}

interface WorkspaceState {
  workspace: Workspace;
  currentWorkspaceId: string | null;
  setCurrentWorkspace: (id: string | null) => void;
  updateWorkspace: (updates: Partial<Workspace>) => void;
  addMember: (member: Omit<WorkspaceMember, 'id' | 'joinedAt'>) => void;
  removeMember: (id: string) => void;
  updateMemberRole: (id: string, role: WorkspaceMember['role']) => void;
}

const defaultWorkspace: Workspace = {
  id: 'ws1',
  name: 'Nexus Studio',
  slug: 'nexus-studio',
  plan: 'pro',
  industry: 'Software Development',
  website: 'https://nexusstudio.io',
  createdAt: '2025-06-01T00:00:00Z',
  members: [
    { id: 'u1', name: 'Alex Morgan', email: 'alex@nexusstudio.io', role: 'owner', avatar: 'AM', joinedAt: '2025-06-01T00:00:00Z', status: 'active' },
    { id: 'u2', name: 'Sarah Chen', email: 'sarah@nexusstudio.io', role: 'admin', avatar: 'SC', joinedAt: '2025-06-15T00:00:00Z', status: 'active' },
    { id: 'u3', name: 'Marcus Reid', email: 'marcus@nexusstudio.io', role: 'member', avatar: 'MR', joinedAt: '2025-07-01T00:00:00Z', status: 'active' },
    { id: 'u4', name: 'Priya Patel', email: 'priya@nexusstudio.io', role: 'member', avatar: 'PP', joinedAt: '2025-08-10T00:00:00Z', status: 'active' },
    { id: 'u5', name: 'James Wu', email: 'james@nexusstudio.io', role: 'member', avatar: 'JW', joinedAt: '2025-09-20T00:00:00Z', status: 'active' },
    { id: 'u6', name: 'Emily Torres', email: 'emily@nexusstudio.io', role: 'viewer', avatar: 'ET', joinedAt: '2026-01-05T00:00:00Z', status: 'invited' },
  ],
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspace: defaultWorkspace,
      currentWorkspaceId: defaultWorkspace.id,
      setCurrentWorkspace: (id) => set({ currentWorkspaceId: id }),
      updateWorkspace: (updates) =>
        set((state) => ({ workspace: { ...state.workspace, ...updates } })),
      addMember: (member) => {
        const newMember: WorkspaceMember = {
          ...member,
          id: `u${Date.now()}`,
          joinedAt: new Date().toISOString(),
        };
        set((state) => ({
          workspace: { ...state.workspace, members: [...state.workspace.members, newMember] },
        }));
      },
      removeMember: (id) => {
        set((state) => ({
          workspace: {
            ...state.workspace,
            members: state.workspace.members.filter((m) => m.id !== id),
          },
        }));
      },
      updateMemberRole: (id, role) => {
        set((state) => ({
          workspace: {
            ...state.workspace,
            members: state.workspace.members.map((m) => (m.id === id ? { ...m, role } : m)),
          },
        }));
      },
    }),
    { name: 'saas-workspace' }
  )
);
