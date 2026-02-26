import { ProjectStatus, MilestoneStatus } from "../../data/mockData";

const projectStatusMap: Record<
  ProjectStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  on_track: { label: "On Track", bg: "#ECFDF5", text: "#059669", dot: "#10B981" },
  at_risk: { label: "At Risk", bg: "#FFFBEB", text: "#D97706", dot: "#F59E0B" },
  completed: { label: "Completed", bg: "#EEF2FF", text: "#4338CA", dot: "#4F46E5" },
  paused: { label: "Paused", bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
};

const milestoneStatusMap: Record<
  MilestoneStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  completed: { label: "Completed", bg: "#ECFDF5", text: "#059669", dot: "#10B981" },
  in_progress: { label: "In Progress", bg: "#EFF6FF", text: "#2563EB", dot: "#3B82F6" },
  upcoming: { label: "Upcoming", bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
  delayed: { label: "Delayed", bg: "#FEF2F2", text: "#DC2626", dot: "#EF4444" },
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

interface MilestoneStatusBadgeProps {
  status: MilestoneStatus;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const config = projectStatusMap[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.dot }}
      />
      {config.label}
    </span>
  );
}

export function MilestoneStatusBadge({ status }: MilestoneStatusBadgeProps) {
  const config = milestoneStatusMap[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.dot }}
      />
      {config.label}
    </span>
  );
}
