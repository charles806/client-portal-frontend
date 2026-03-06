import { useNavigate } from 'react-router';
import { Calendar, DollarSign, Users, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { Project } from '../../store/projectStore';

interface ProjectCardProps {
  project: Project;
}

const progressColors: Record<string, string> = {
  active: 'bg-indigo-500',
  planning: 'bg-blue-500',
  'on-hold': 'bg-amber-500',
  completed: 'bg-emerald-500',
};

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const budgetPercent = Math.round((project.spent / project.budget) * 100);
  const isOverBudget = project.spent > project.budget;

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 p-6 hover:shadow-xl hover:shadow-indigo-100/60 hover:border-indigo-200/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${progressColors[project.status]} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={project.status} />
          </div>
          <h3 className="text-slate-900 truncate pr-2 mt-2" style={{ fontWeight: 600, fontSize: '1rem' }}>
            {project.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{project.client || 'General Client'}</p>
        </div>
        <ArrowRight className="size-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-1" />
      </div>

      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
        {project.description || 'No description provided.'}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500">Progress</span>
          <span className="text-xs font-semibold text-slate-700">{project.progress || 0}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressColors[project.status]}`}
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {project.dueDate
              ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'No date'}
          </span>
          <span className={`flex items-center gap-1 ${isOverBudget ? 'text-red-500' : ''}`}>
            <DollarSign className="size-3.5" />
            {budgetPercent || 0}%
          </span>
        </div>
        {/* Team avatars */}
        <div className="flex items-center">
          {(project.team || []).slice(0, 3).map((member, i) => (
            <div
              key={member.id}
              className="size-6 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white flex items-center justify-center text-white"
              style={{ fontSize: '0.6rem', fontWeight: 700, marginLeft: i === 0 ? 0 : '-6px' }}
              title={member.name}
            >
              {member.avatar}
            </div>
          ))}
          {(project.team?.length || 0) > 3 && (
            <div
              className="size-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600"
              style={{ fontSize: '0.6rem', fontWeight: 600, marginLeft: '-6px' }}
            >
              +{(project.team?.length || 0) - 3}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {(project.tags?.length || 0) > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
          {(project.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
