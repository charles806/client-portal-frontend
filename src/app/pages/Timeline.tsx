import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, Circle, Calendar, ExternalLink, Filter } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { StatusBadge } from '../components/dashboard/StatusBadge';
import { useProjects } from '../hooks/useProjects';
import { sanitizeValue } from '../components/ui/sanitization';
import { useWorkspaceStore } from '../store/workspaceStore';
import type { Project } from '../hooks/useProjects';

type FilterType = 'all' | 'pending' | 'completed' | 'overdue';

export default function Timeline() {
  const { currentWorkspaceId } = useWorkspaceStore();
  const { projects } = useProjects(currentWorkspaceId || undefined);
  const completeMilestone = (pid: string, mid: string) => { }; // Placeholder for now
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  // Collect all milestones with project info
  const allMilestones = projects.flatMap((project: any) =>
    (project.milestones || []).map((m: any) => ({ ...m, project }))
  );

  // Apply filters
  const now = new Date();
  const filtered = allMilestones.filter((m) => {
    const projectMatch = selectedProject === 'all' || m.project.id === selectedProject;
    const isOverdue = !m.completed && new Date(m.dueDate) < now;
    const statusMatch =
      filter === 'all' ||
      (filter === 'completed' && m.completed) ||
      (filter === 'pending' && !m.completed && !isOverdue) ||
      (filter === 'overdue' && isOverdue);
    return projectMatch && statusMatch;
  });

  // Sort by due date
  const sorted = [...filtered].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Group by month
  const grouped: Record<string, typeof sorted> = {};
  sorted.forEach((m) => {
    const month = new Date(m.dueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(m);
  });

  const stats = {
    total: allMilestones.length,
    completed: allMilestones.filter((m) => m.completed).length,
    pending: allMilestones.filter((m) => !m.completed && new Date(m.dueDate) >= now).length,
    overdue: allMilestones.filter((m) => !m.completed && new Date(m.dueDate) < now).length,
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Timeline"
        subtitle={`${stats.total} milestones across ${projects.length} projects`}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
            { label: 'Completed', value: stats.completed, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: 'Pending', value: stats.pending, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
            { label: 'Overdue', value: stats.overdue, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} className={`rounded-xl p-4 border ${border} ${bg}`}>
              <p className="text-xs text-slate-500 mb-1" style={{ fontWeight: 600 }}>{label}</p>
              <p className={`text-2xl ${color}`} style={{ fontWeight: 800 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur border border-slate-200 rounded-xl p-1">
            {(['all', 'pending', 'completed', 'overdue'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all cursor-pointer ${filter === f ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                style={{ fontWeight: 600 }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-3.5 text-slate-400" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(sanitizeValue(e.target.value))}
              className="px-3 py-2 rounded-xl bg-white/80 border border-slate-200 text-slate-700 text-xs outline-none focus:border-indigo-400 transition-all cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              <option value="all">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline */}
        {Object.keys(grouped).length === 0 ? (
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-dashed border-slate-300 p-16 text-center">
            <Calendar className="size-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500" style={{ fontWeight: 500 }}>No milestones found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([month, milestones]) => (
              <div key={month}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{month}</h3>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400" style={{ fontWeight: 500 }}>
                    {milestones.filter((m) => m.completed).length}/{milestones.length} done
                  </span>
                </div>

                <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                  {milestones.map((milestone, i) => {
                    const isOverdue = !milestone.completed && new Date(milestone.dueDate) < now;
                    const daysUntil = Math.ceil((new Date(milestone.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <div
                        key={milestone.id}
                        className={`relative ml-4 rounded-xl p-4 border transition-all ${milestone.completed ? 'bg-emerald-50/60 border-emerald-100' : isOverdue ? 'bg-red-50/60 border-red-100' : 'bg-white/70 backdrop-blur-xl border-white/60 shadow-sm hover:shadow-md'}`}
                      >
                        {/* Timeline dot */}
                        <div className={`absolute -left-6 top-1/2 -translate-y-1/2 size-3 rounded-full border-2 border-white ${milestone.completed ? 'bg-emerald-500' : isOverdue ? 'bg-red-400' : 'bg-indigo-400'}`} />

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <button
                              onClick={() => completeMilestone(milestone.project.id, milestone.id)}
                              className="cursor-pointer transition-transform hover:scale-110 mt-0.5 shrink-0"
                            >
                              {milestone.completed ? (
                                <CheckCircle2 className="size-5 text-emerald-500" />
                              ) : (
                                <Circle className={`size-5 ${isOverdue ? 'text-red-300' : 'text-slate-300'} hover:text-indigo-400 transition-colors`} />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${milestone.completed ? 'line-through text-slate-400' : 'text-slate-800'}`} style={{ fontWeight: 600 }}>
                                {milestone.title}
                              </p>
                              {milestone.description && (
                                <p className="text-slate-400 text-xs mt-0.5">{milestone.description}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                <StatusBadge status={milestone.project.status} />
                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                  <Calendar className="size-3" />
                                  {new Date(milestone.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                {!milestone.completed && (
                                  <span className={`text-xs ${isOverdue ? 'text-red-500' : daysUntil <= 7 ? 'text-amber-500' : 'text-slate-400'}`} style={{ fontWeight: 500 }}>
                                    {isOverdue ? `${Math.abs(daysUntil)}d overdue` : daysUntil === 0 ? 'Due today' : `${daysUntil}d left`}
                                  </span>
                                )}
                                {milestone.completed && milestone.completedAt && (
                                  <span className="text-xs text-emerald-600" style={{ fontWeight: 500 }}>
                                    ✓ {new Date(milestone.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => navigate(`/projects/${milestone.project.id}`)}
                            className="flex items-center gap-1.5 shrink-0 text-xs text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                            style={{ fontWeight: 500 }}
                          >
                            <span className="hidden sm:inline truncate max-w-24">{milestone.project.name}</span>
                            <ExternalLink className="size-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
