import { useState } from "react";
import { MoreHorizontal, Edit2, Trash2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import { useProjectStore } from "../../../store/projectStore";
import type { Project } from "../../data/mockData";

interface ProjectMenuProps {
  project: Project;
  onEdit?: () => void;
}

export function ProjectMenu({ project, onEdit }: ProjectMenuProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const deleteProject = useProjectStore((s) => s.deleteProject);

  const handleDelete = () => {
    if (confirm(`Delete "${project.name}"?`)) {
      deleteProject(project.id);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer"
            >
              <Edit2 size={14} className="text-gray-400" />
              Edit Project
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/projects/${project.id}`);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer"
            >
              <ExternalLink size={14} className="text-gray-400" />
              View Details
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-sm text-red-600 cursor-pointer"
            >
              <Trash2 size={14} />
              Delete Project
            </button>
          </div>
        </>
      )}
    </div>
  );
}
