import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useProjectStore } from "../../../store/projectStore";
import type { Project } from "../../data/mockData";

interface EditProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

export function EditProjectModal({
  open,
  onClose,
  project,
}: EditProjectModalProps) {
  const updateProject = useProjectStore((s) => s.updateProject);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Project["status"]>("active");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClient(project.client);
      setDescription(project.description);
      setStatus(project.status);
      setProgress(project.progress);
    }
  }, [project]);

  if (!open || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject(project.id, { name, client, description, status, progress });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit Project</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Client</label>
            <input
              type="text"
              required
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-300 cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="at-risk">At Risk</option>
                <option value="on-hold">On Hold</option>
                <option value="planning">Planning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-300"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
