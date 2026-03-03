import type { ProjectStatus } from '../../store/projectStore';

const statusConfig: Record<ProjectStatus, { label: string; className: string; dot: string }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  planning: {
    label: 'Planning',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
  },
  'on-hold': {
    label: 'On Hold',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
  },
  completed: {
    label: 'Completed',
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
    dot: 'bg-slate-400',
  },
};

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.className} ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
    >
      <span className={`rounded-full ${config.dot} ${size === 'sm' ? 'size-1.5' : 'size-2'}`} />
      {config.label}
    </span>
  );
}
