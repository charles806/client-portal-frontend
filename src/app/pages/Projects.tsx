import { useState } from 'react';
import { Plus, Search, Filter, FolderKanban, LayoutGrid, List } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { Input } from '../components/ui/input';
import { StatusBadge } from '../components/dashboard/StatusBadge';
import { AddProjectModal } from '../components/modals/AddProjectModal';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from 'react-router';
import type { ProjectStatus } from '../store/projectStore';
import { useWorkspaceStore } from '../store/workspaceStore';

const statusFilters: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Planning', value: 'planning' },
  { label: 'On Hold', value: 'on-hold' },
  { label: 'Completed', value: 'completed' },
];

export default function Projects() {
  const { currentWorkspaceId } = useWorkspaceStore();
  const { projects, stats } = useProjects(currentWorkspaceId || undefined);
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(n);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Projects"
        subtitle={`${stats.total} total · ${stats.active} active`}
        action={
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-colors cursor-pointer shadow-md shadow-indigo-200 text-sm"
            style={{ fontWeight: 600 }}
          >
            <Plus className="size-3.5" /> New Project
          </button>
        }
      />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-normal"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur border border-slate-200 rounded-xl p-1">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${statusFilter === f.value ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                style={{ fontWeight: 600 }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View mode */}
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur border border-slate-200 rounded-xl p-1 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-dashed border-slate-300 p-16 text-center">
            <FolderKanban className="size-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-1" style={{ fontWeight: 600 }}>No projects found</p>
            <p className="text-slate-400 text-sm mb-4">
              {search ? `No results for "${search}"` : 'Create your first project to get started'}
            </p>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 mx-auto px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer text-sm"
              style={{ fontWeight: 600 }}
            >
              <Plus className="size-3.5" /> New Project
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project as any} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 text-slate-500 text-xs" style={{ fontWeight: 600 }}>Project</th>
                  <th className="text-left px-5 py-3.5 text-slate-500 text-xs" style={{ fontWeight: 600 }}>Client</th>
                  <th className="text-left px-5 py-3.5 text-slate-500 text-xs" style={{ fontWeight: 600 }}>Status</th>
                  <th className="text-left px-5 py-3.5 text-slate-500 text-xs" style={{ fontWeight: 600 }}>Progress</th>
                  <th className="text-left px-5 py-3.5 text-slate-500 text-xs" style={{ fontWeight: 600 }}>Budget</th>
                  <th className="text-left px-5 py-3.5 text-slate-500 text-xs" style={{ fontWeight: 600 }}>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="border-b border-slate-50 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{p.name}</p>
                      <div className="flex gap-1 mt-1">
                        {p.tags.slice(0, 2).map((t) => (
                          <span key={t} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 text-sm">{p.client}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-20">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-500" style={{ fontWeight: 500 }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 text-sm">{formatCurrency(p.budget)}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-sm">
                      {new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddProjectModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
