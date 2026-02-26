import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, DollarSign, Edit2 } from "lucide-react";
import { useState } from "react";
import { Header } from "../components/layout/Header";
import { useProjectStore } from "../../store/projectStore";
import { ProgressBar } from "../components/ui/ProgressBar";
import { ProjectStatusBadge } from "../components/ui/StatusBadge";
import { EditProjectModal } from "../components/modals/EditProjectModal";

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projects = useProjectStore((s) => s.projects);
  const project = projects.find((p) => p.id === id);
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Project not found</p>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 cursor-pointer"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={project.name}
        subtitle={project.client}
        actions={
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Edit2 size={14} />
            <span style={{ fontSize: "13px", fontWeight: 500 }}>
              Edit Project
            </span>
          </button>
        }
      />

      <div className="p-4 lg:p-6">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back to Projects</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Overview</h2>
                <ProjectStatusBadge status={project.status} />
              </div>
              <p className="text-gray-600 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Progress</h2>
              <ProgressBar
                value={project.progress}
                status={project.status}
                size="md"
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="text-sm font-medium">{project.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="text-sm font-medium">{project.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Spent</p>
                    <p className="text-sm font-medium">{project.spent}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Team</h2>
              <div className="space-y-3">
                {project.team.map((member, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-700 text-xs font-semibold">
                        {member.avatar}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{member.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProjectModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        project={project}
      />
    </div>
  );
}
