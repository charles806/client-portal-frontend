import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: ReactNode;
  iconBg: string;
  description?: string;
}

export function MetricCard({
  label,
  value,
  change,
  changePositive,
  icon,
  iconBg,
  description,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
            changePositive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}>
            {changePositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <span style={{ fontSize: "11px", fontWeight: 600 }}>{change}</span>
          </div>
        )}
      </div>
      <p className="text-gray-500 mb-1" style={{ fontSize: "12px", fontWeight: 500 }}>{label}</p>
      <p className="text-gray-900" style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>
        {value}
      </p>
      {description && (
        <p className="text-gray-400 mt-1" style={{ fontSize: "11.5px" }}>{description}</p>
      )}
    </div>
  );
}
