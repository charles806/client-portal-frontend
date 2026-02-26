import { useState } from "react";
import { ArrowUpRight, CheckSquare, Calendar, DollarSign } from "lucide-react";
import { Project } from "../../data/mockData";
import { ProjectStatusBadge } from "./StatusBadge";
import { useNavigate } from "react-router";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const avatarColors = [
  "#4F46E5",
  "#7C3AED",
  "#0891B2",
  "#059669",
  "#D97706",
  "#DC2626",
];

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer w-full"
      style={{
        borderColor: hovered ? "#C7D2FE" : "#E5E7EB",
        boxShadow: hovered
          ? "0 4px 24px -4px rgba(79, 70, 229, 0.12), 0 1px 4px -2px rgba(0,0,0,0.06)"
          : "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Card Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ProjectStatusBadge status={project.status} />
            </div>
            <h3
              className="text-sm font-semibold leading-snug truncate"
              style={{ color: "#111827", fontFamily: "Inter, sans-serif" }}
            >
              {project.name}
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
            >
              {project.client}
            </p>
          </div>
          <div
            className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0 transition-colors"
            style={{ backgroundColor: hovered ? "#EEF2FF" : "#F9FAFB" }}
          >
            <ArrowUpRight
              size={14}
              style={{ color: hovered ? "#4F46E5" : "#9CA3AF" }}
            />
          </div>
        </div>

        <p
          className="text-xs leading-relaxed line-clamp-2"
          style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
        >
          {project.description}
        </p>
      </div>

      {/* Progress Section */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-medium"
            style={{ color: "#374151", fontFamily: "Inter, sans-serif" }}
          >
            Progress
          </span>
          <span
            className="text-xs font-semibold"
            style={{
              color:
                project.progress === 100
                  ? "#059669"
                  : project.status === "at_risk"
                    ? "#D97706"
                    : "#4F46E5",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {project.progress}%
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "#F3F4F6" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${project.progress}%`,
              backgroundColor:
                project.progress === 100
                  ? "#10B981"
                  : project.status === "at_risk"
                    ? "#F59E0B"
                    : project.status === "paused"
                      ? "#9CA3AF"
                      : "#4F46E5",
            }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div
        className="px-5 py-3 border-t flex items-center gap-4"
        style={{ borderColor: "#F3F4F6" }}
      >
        <div className="flex items-center gap-1.5">
          <CheckSquare size={12} style={{ color: "#9CA3AF" }} />
          <span
            className="text-xs"
            style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
          >
            {project.tasksCompleted}/{project.tasksTotal}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} style={{ color: "#9CA3AF" }} />
          <span
            className="text-xs"
            style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
          >
            {project.dueDate}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign size={12} style={{ color: "#9CA3AF" }} />
          <span
            className="text-xs"
            style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
          >
            {project.spent}
          </span>
        </div>
      </div>

      {/* Team Avatars */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {project.team.map((member, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
              style={{
                backgroundColor: avatarColors[i % avatarColors.length],
                fontSize: "9px",
                fontWeight: 700,
                color: "#FFFFFF",
                fontFamily: "Inter, sans-serif",
              }}
              title={member.name}
            >
              {member.avatar}
            </div>
          ))}
        </div>
        <span
          className="text-xs"
          style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
        >
          {project.team.length} member{project.team.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
