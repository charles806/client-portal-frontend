interface ProgressBarProps {
  value: number;
  status?: "active" | "completed" | "at-risk" | "on-hold" | "planning";
  showLabel?: boolean;
  size?: "sm" | "md";
}

const statusColors: Record<string, string> = {
  active: "bg-indigo-500",
  completed: "bg-emerald-500",
  "at-risk": "bg-red-500",
  "on-hold": "bg-amber-500",
  planning: "bg-blue-400",
};

export function ProgressBar({ value, status = "active", showLabel = true, size = "sm" }: ProgressBarProps) {
  const barColor = statusColors[status] || "bg-indigo-500";
  const height = size === "sm" ? "h-1.5" : "h-2";
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-gray-500" style={{ fontSize: "11px", fontWeight: 500 }}>Progress</span>
          <span className="text-gray-700" style={{ fontSize: "11px", fontWeight: 600 }}>{clamped}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
