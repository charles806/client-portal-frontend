import type { ProjectStatus } from "../../data/mockData";

const projectStatusMap: Record<
  ProjectStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  active: { label: "Active", bg: "#EEF2FF", text: "#4338CA", dot: "#4F46E5" },
  "at-risk": {
    label: "At Risk",
    bg: "#FFFBEB",
    text: "#D97706",
    dot: "#F59E0B",
  },
  completed: {
    label: "Completed",
    bg: "#ECFDF5",
    text: "#059669",
    dot: "#10B981",
  },
  "on-hold": {
    label: "On Hold",
    bg: "#FEF2F2",
    text: "#DC2626",
    dot: "#EF4444",
  },
  planning: {
    label: "Planning",
    bg: "#EFF6FF",
    text: "#2563EB",
    dot: "#3B82F6",
  },
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const config = projectStatusMap[status] || projectStatusMap.active;

  if (!config) {
    console.error(`Unknown status: ${status}`);
    return null;
  }

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

export { ProjectStatusBadge as StatusBadge };
