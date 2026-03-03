import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-indigo-600',
  iconBg = 'bg-indigo-50',
  subtitle,
}: StatsCardProps) {
  const changeColors = {
    positive: 'text-emerald-600',
    negative: 'text-red-500',
    neutral: 'text-slate-500',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/50 p-6 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-0.5 cursor-default">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-3xl text-slate-900" style={{ fontWeight: 700 }}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {change && (
            <p className={`text-xs mt-2 font-medium ${changeColors[changeType]}`}>
              {changeType === 'positive' && '↑ '}
              {changeType === 'negative' && '↓ '}
              {change}
            </p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${iconBg}`}>
          <Icon className={`size-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
