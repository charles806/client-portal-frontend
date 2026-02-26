import { useState } from "react";
import { CheckCircle2, Clock, Circle, AlertCircle, ChevronDown, CalendarDays, Plus } from "lucide-react";
import { Header } from "../components/layout/Header";
import { StatusBadge } from "../components/ui/StatusBadge";
import { milestones, projects } from "../data/mockData";

const STATUS_ICONS = {
  completed: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200", line: "bg-emerald-400" },
  "in-progress": { icon: Clock, color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-200", line: "bg-indigo-300" },
  upcoming: { icon: Circle, color: "text-gray-400", bg: "bg-gray-50 border-gray-200", line: "bg-gray-200" },
  overdue: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 border-red-200", line: "bg-red-300" },
};

export function Timeline() {
  const [filter, setFilter] = useState<string>("all");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filteredMilestones = milestones.filter((m) => {
    if (filter === "all") return true;
    return m.status === filter;
  });

  // Group by project
  const grouped = projects.reduce<Record<string, typeof milestones>>((acc, project) => {
    const ms = filteredMilestones.filter((m) => m.projectId === project.id);
    if (ms.length > 0) acc[project.id] = ms;
    return acc;
  }, {});

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "in-progress", label: "In Progress" },
    { value: "upcoming", label: "Upcoming" },
    { value: "overdue", label: "Overdue" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Timeline"
        subtitle={`${milestones.length} milestones across ${projects.length} projects`}
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm">
            <Plus size={14} />
            <span style={{ fontSize: "13px", fontWeight: 500 }}>Add Milestone</span>
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "Completed",
              count: milestones.filter((m) => m.status === "completed").length,
              total: milestones.length,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              bar: "bg-emerald-500",
            },
            {
              label: "In Progress",
              count: milestones.filter((m) => m.status === "in-progress").length,
              total: milestones.length,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
              bar: "bg-indigo-500",
            },
            {
              label: "Upcoming",
              count: milestones.filter((m) => m.status === "upcoming").length,
              total: milestones.length,
              color: "text-gray-600",
              bg: "bg-gray-100",
              bar: "bg-gray-400",
            },
            {
              label: "Overdue",
              count: milestones.filter((m) => m.status === "overdue").length,
              total: milestones.length,
              color: "text-red-600",
              bg: "bg-red-50",
              bar: "bg-red-500",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500" style={{ fontSize: "12px", fontWeight: 500 }}>{stat.label}</span>
                <span className={`${stat.color} ${stat.bg} px-2 py-0.5 rounded-full`} style={{ fontSize: "12px", fontWeight: 700 }}>
                  {stat.count}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 ${stat.bar} rounded-full`}
                  style={{ width: `${(stat.count / stat.total) * 100}%` }}
                />
              </div>
              <p className="text-gray-400 mt-1.5" style={{ fontSize: "11px" }}>
                {Math.round((stat.count / stat.total) * 100)}% of total
              </p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1 w-fit">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-md transition-all duration-150 ${
                filter === opt.value
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              style={{ fontSize: "12.5px", fontWeight: 500 }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Timeline by Project */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([projectId, projectMilestones]) => {
            const project = projects.find((p) => p.id === projectId)!;
            const isExpanded = expandedProject !== projectId;

            return (
              <div key={projectId} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Project Header */}
                <button
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedProject(isExpanded ? projectId : null)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                      <CalendarDays size={14} className="text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-gray-900" style={{ fontSize: "13.5px", fontWeight: 600 }}>
                        {project.name}
                      </p>
                      <p className="text-gray-400" style={{ fontSize: "11.5px" }}>
                        {project.client} · {projectMilestones.length} milestone{projectMilestones.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={project.status} />
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "" : "rotate-180"}`}
                    />
                  </div>
                </button>

                {/* Milestones Timeline */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-50">
                    {/* Timeline Track */}
                    <div className="mt-4 space-y-0">
                      {projectMilestones.map((milestone, index) => {
                        const config = STATUS_ICONS[milestone.status];
                        const Icon = config.icon;
                        const isLast = index === projectMilestones.length - 1;

                        return (
                          <div key={milestone.id} className="flex gap-4 group">
                            {/* Left: Icon + Line */}
                            <div className="flex flex-col items-center flex-shrink-0" style={{ width: "32px" }}>
                              <div className={`w-8 h-8 rounded-full border-2 ${config.bg} flex items-center justify-center z-10 group-hover:scale-110 transition-transform`}>
                                <Icon size={14} className={config.color} />
                              </div>
                              {!isLast && (
                                <div className={`w-0.5 flex-1 ${config.line} mt-1 min-h-6 opacity-40`} />
                              )}
                            </div>

                            {/* Right: Content */}
                            <div className={`flex-1 pb-${isLast ? "0" : "5"} min-w-0 pt-1.5`} style={{ paddingBottom: isLast ? 0 : "20px" }}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-gray-900" style={{ fontSize: "13px", fontWeight: 600 }}>
                                      {milestone.title}
                                    </p>
                                    <StatusBadge status={milestone.status} />
                                  </div>
                                  <p className="text-gray-500 mt-1" style={{ fontSize: "12px", lineHeight: 1.5 }}>
                                    {milestone.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <span className="text-gray-400" style={{ fontSize: "11.5px" }}>
                                      📅 {milestone.date}
                                    </span>
                                    <span className="text-gray-400" style={{ fontSize: "11.5px" }}>
                                      👤 {milestone.assignee}
                                    </span>
                                  </div>
                                </div>
                                {milestone.status === "overdue" && (
                                  <div className="flex-shrink-0 px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg">
                                    <span className="text-red-600" style={{ fontSize: "11px", fontWeight: 600 }}>Past Due</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {Object.keys(grouped).length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <CalendarDays size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-700 mb-1" style={{ fontSize: "14px", fontWeight: 600 }}>No milestones found</p>
            <p className="text-gray-400" style={{ fontSize: "13px" }}>
              Try adjusting your filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
