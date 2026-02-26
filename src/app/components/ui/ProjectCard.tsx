import { useState } from "react";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router";
import type { Project } from "../../data/mockData";
import { ProjectStatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import { ProjectMenu } from "./ProjectMenu";

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
}

const tagColors: Record<string, string> = {
  "UX Design": "bg-violet-50 text-violet-600",
  Development: "bg-indigo-50 text-indigo-600",
  Data: "bg-blue-50 text-blue-600",
  Analytics: "bg-cyan-50 text-cyan-600",
  Migration: "bg-amber-50 text-amber-600",
  Cloud: "bg-sky-50 text-sky-600",
  Mobile: "bg-pink-50 text-pink-600",
  iOS: "bg-rose-50 text-rose-600",
  Android: "bg-orange-50 text-orange-600",
  Security: "bg-red-50 text-red-600",
  Compliance: "bg-yellow-50 text-yellow-600",
  AI: "bg-emerald-50 text-emerald-600",
  Integration: "bg-teal-50 text-teal-600",
};

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer ${
        hovered
          ? "border-indigo-200 shadow-md shadow-indigo-50"
          : "border-gray-100 shadow-sm"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Card Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <p
              className="text-gray-400 mb-1 truncate"
              style={{ fontSize: "11px", fontWeight: 500 }}
            >
              {project.client}
            </p>
            <h3
              className="text-gray-900 truncate"
              style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.4 }}
            >
              {project.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <ProjectStatusBadge status={project.status} />
            <ProjectMenu project={project} onEdit={onEdit} />
          </div>
        </div>

        <p
          className="text-gray-500 mb-4 line-clamp-2"
          style={{ fontSize: "12.5px", lineHeight: 1.6 }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 rounded-md ${tagColors[tag] || "bg-gray-100 text-gray-500"}`}
              style={{ fontSize: "11px", fontWeight: 500 }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Progress */}
        <ProgressBar value={project.progress} status={project.status} />
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Calendar size={12} />
          <span style={{ fontSize: "11.5px" }}>{project.dueDate}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Team Avatars */}
          <div className="flex -space-x-1.5">
            {project.team.slice(0, 3).map((member) => (
              <div
                key={member.name}
                className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center"
                title={member.name}
              >
                <span
                  className="text-indigo-700"
                  style={{ fontSize: "9px", fontWeight: 600 }}
                >
                  {member.avatar}
                </span>
              </div>
            ))}
            {project.team.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span
                  className="text-gray-500"
                  style={{ fontSize: "9px", fontWeight: 600 }}
                >
                  +{project.team.length - 3}
                </span>
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="text-right">
            <span
              className="text-gray-900"
              style={{ fontSize: "11.5px", fontWeight: 600 }}
            >
              {project.spent}
            </span>
            <span className="text-gray-400" style={{ fontSize: "11.5px" }}>
              {" "}
              / {project.budget}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Action */}
      {hovered && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500 rounded-b-xl" />
      )}
    </div>
  );
}
