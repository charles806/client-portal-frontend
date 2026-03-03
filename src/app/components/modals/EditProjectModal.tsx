import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Spinner } from '../ui/ios-spinner';

import { useProjects } from '../../hooks/useProjects';
import { useWorkspaceStore } from '../../store/workspaceStore';
import type { Project, ProjectStatus } from '../../store/projectStore';

import { toast } from 'sonner';

interface EditProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function EditProjectModal({ project, onClose }: EditProjectModalProps) {
  const { currentWorkspaceId } = useWorkspaceStore();
  const { updateProject, isLoading } = useProjects(currentWorkspaceId || undefined);

  const [form, setForm] = useState({
    name: '',
    description: '',
    client: '',
    status: 'planning' as ProjectStatus,
    budget: '',
    dueDate: '',
    startDate: '',
    progress: '',
    tags: '',
  });

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name,
        description: project.description,
        client: project.client,
        status: project.status,
        budget: project.budget.toString(),
        dueDate: project.dueDate,
        startDate: project.startDate,
        progress: project.progress.toString(),
        tags: project.tags.join(', '),
      });
    }
  }, [project]);

  if (!project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProject({
        id: project.id,
        data: {
          name: form.name,
          description: form.description,
          client: form.client,
          status: form.status,
          budget: parseFloat(form.budget) || 0,
          endDate: form.dueDate,
          startDate: form.startDate,
          progress: parseInt(form.progress) || 0,
          priority: (project as any).priority || 'medium',
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        } as any,
      });


      toast.success('Project updated successfully!');
      onClose();
    } catch {
      toast.error('Failed to update project');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-slate-900" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Edit Project</h2>
            <p className="text-slate-500 text-xs mt-0.5">Update project details</p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 600 }}>Project Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 600 }}>Client</label>
              <input
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 600 }}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm cursor-pointer"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 600 }}>Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 600 }}>Budget ($)</label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 600 }}>Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm cursor-pointer"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 600 }}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 600 }}>Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-colors cursor-pointer text-sm shadow-lg shadow-indigo-200 disabled:opacity-60"
            >
              {isLoading ? <Spinner size="sm" className="text-white" /> : <Save className="size-4" />}

              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
