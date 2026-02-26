import { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  suffix?: string;
}

export function StatsCard({
  label,
  value,
  change,
  changePositive,
  icon,
  iconBg,
  suffix,
}: StatsCardProps) {
  return (
    <div
      className="bg-white rounded-xl border px-5 py-4 flex flex-col gap-3"
      style={{
        borderColor: "#E5E7EB",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium"
          style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
        >
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span
            className="text-2xl font-bold"
            style={{ color: "#111827", fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}
          >
            {value}
          </span>
          {suffix && (
            <span
              className="text-sm"
              style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
            >
              {suffix}
            </span>
          )}
        </div>
        {change && (
          <p
            className="text-xs mt-0.5"
            style={{
              color: changePositive ? "#059669" : "#DC2626",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {changePositive ? "↑" : "↓"} {change}
          </p>
        )}
      </div>
    </div>
  );
}
