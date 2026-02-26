import { useState } from "react";
import { Plus, Search, Grid3x3, List } from "lucide-react";
import { Header } from "../components/layout/Header";
import { ProjectCard } from "../components/ui/ProjectCard";
import { useProjectStore } from "../../store/projectStore";
import { AddProjectModal } from "../components/modals/AddProjectModal";
import { EditProjectModal } from "../components/modals/EditProjectModal";
import type { Project } from "../data/mockData";

export function Projects() {
  const {
    filteredProjects,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterStatus,
    setFilterStatus,
  } = useProjectStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const projects = filteredProjects();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""}`}
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={14} />
            <span style={{ fontSize: "13px", fontWeight: 500 }}>
              New Project
            </span>
          </button>
        }
      />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm cursor-pointer outline-none focus:border-indigo-300"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="at-risk">At Risk</option>
            <option value="on-hold">On Hold</option>
            <option value="planning">Planning</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm cursor-pointer outline-none focus:border-indigo-300"
          >
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>

          {/* View Toggle */}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === "grid" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === "list" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => setEditingProject(project)}
            />
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No projects found</p>
          </div>
        )}
      </div>

      <AddProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EditProjectModal
        open={!!editingProject}
        onClose={() => setEditingProject(null)}
        project={editingProject}
      />
    </div>
  );
}
