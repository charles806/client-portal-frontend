import { useState } from "react";
import { ArrowUpRight, CheckSquare, Calendar, DollarSign } from "lucide-react";
import { Project } from "../../data/mockData";
import { ProjectStatusBadge } from "./StatusBadge";
import { useNavigate } from "react-router";
import { cn } from "../ui/utils";

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
      className={cn(
        "glass rounded-2xl overflow-hidden cursor-pointer w-full group transition-all duration-300",
        hovered ? "shadow-lg -translate-y-1 border-white/40" : "shadow-sm"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Card Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <ProjectStatusBadge status={project.status} />
            </div>
            <h3 className="text-sm font-semibold leading-snug truncate text-foreground tracking-tight">
              {project.name}
            </h3>
            <p className="text-xs mt-1 text-muted-foreground font-medium">
              {project.client}
            </p>
          </div>
          <div
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-xl shrink-0 transition-all duration-300",
              hovered ? "bg-primary/20 scale-110" : "bg-foreground/5"
            )}
          >
            <ArrowUpRight
              size={16}
              className={cn(
                "transition-colors duration-300",
                hovered ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
        </div>

        <p className="text-xs leading-relaxed line-clamp-2 text-muted-foreground/90">
          {project.description}
        </p>
      </div>

      {/* Progress Section */}
      <div className="px-6 pb-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
            Progress
          </span>
          <span
            className={cn(
              "text-xs font-bold",
              project.progress === 100
                ? "text-emerald-500"
                : project.status === "at-risk"
                  ? "text-amber-500"
                  : "text-primary"
            )}
          >
            {project.progress}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden bg-foreground/5 p-[1px]">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(88,80,236,0.3)]",
              project.progress === 100
                ? "bg-emerald-500 shadow-emerald-500/20"
                : project.status === "at-risk"
                  ? "bg-amber-500 shadow-amber-500/20"
                  : project.status === "on-hold"
                    ? "bg-slate-400"
                    : "bg-primary"
            )}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-6 py-4 border-t border-foreground/5 flex items-center gap-5 bg-foreground/[0.02]">
        <div className="flex items-center gap-1.5 group/stat">
          <DollarSign size={13} className="text-muted-foreground group-hover/stat:text-primary transition-colors" />
          <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
            {project.spent}
          </span>
        </div>
        <div className="flex items-center gap-1.5 group/stat">
          <Calendar size={13} className="text-muted-foreground group-hover/stat:text-primary transition-colors" />
          <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
            {project.dueDate}
          </span>
        </div>
      </div>

      {/* Team Avatars */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {(project.team || []).map((member, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-background shadow-sm hover:z-10 transition-transform hover:-translate-y-1"
              style={{
                backgroundColor: avatarColors[i % avatarColors.length],
                fontSize: "10px",
                fontWeight: 700,
                color: "#FFFFFF",
              }}
              title={member.name}
            >
              {member.avatar}
            </div>
          ))}
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">
          {project.team?.length || 0} member{(project.team?.length || 0) !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

