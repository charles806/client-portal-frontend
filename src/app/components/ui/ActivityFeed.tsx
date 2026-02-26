import { MessageCircle, Upload, RefreshCw, CheckCircle, ThumbsUp } from "lucide-react";
import type { Activity } from "../../data/mockData";

interface ActivityFeedProps {
  activities: Activity[];
}

const typeConfig: Record<string, { icon: typeof MessageCircle; color: string; bg: string }> = {
  comment: { icon: MessageCircle, color: "text-blue-600", bg: "bg-blue-50" },
  upload: { icon: Upload, color: "text-violet-600", bg: "bg-violet-50" },
  update: { icon: RefreshCw, color: "text-amber-600", bg: "bg-amber-50" },
  milestone: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  approval: { icon: ThumbsUp, color: "text-indigo-600", bg: "bg-indigo-50" },
};

const avatarColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
];

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-0">
      {activities.map((activity, index) => {
        const config = typeConfig[activity.type];
        const Icon = config.icon;
        const avatarColor = avatarColors[index % avatarColors.length];

        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-5 px-5 transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <span className="text-white" style={{ fontSize: "10px", fontWeight: 600 }}>
                {activity.avatar}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: "12.5px" }}>
                <span style={{ fontWeight: 600 }}>{activity.user}</span>
                {" "}
                <span className="text-gray-500">{activity.action}</span>
                {" "}
                <span className="text-indigo-600" style={{ fontWeight: 500 }}>{activity.target}</span>
              </p>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: "11px" }}>{activity.time}</p>
            </div>

            {/* Type Icon */}
            <div className={`w-6 h-6 rounded-md ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <Icon size={12} className={config.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
