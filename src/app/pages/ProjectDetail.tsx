import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, Edit2, Trash2, Calendar, DollarSign, Users, CheckCircle2, Circle, Plus, Clock,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { StatusBadge } from '../components/dashboard/StatusBadge';
import { EditProjectModal } from '../components/modals/EditProjectModal';
import { useProjects } from '../hooks/useProjects';
import { toast } from 'sonner';
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from 'recharts';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, completeMilestone, removeProject } = useProjects();
  const [editOpen, setEditOpen] = useState(false);
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', dueDate: '' });
  const { addMilestone } = useProjects();

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Project Not Found" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 mb-4">This project doesn't exist or was deleted.</p>
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer text-sm"
              style={{ fontWeight: 600 }}
            >
              <ArrowLeft className="size-4" /> Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    await removeProject(project.id);
    toast.success('Project deleted');
    navigate('/projects');
  };

  const handleAddMilestone = () => {
    if (!newMilestone.title || !newMilestone.dueDate) {
      toast.error('Title and due date are required');
      return;
    }
    addMilestone(project.id, { ...newMilestone, completed: false });
    setNewMilestone({ title: '', description: '', dueDate: '' });
    setAddingMilestone(false);
    toast.success('Milestone added');
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const budgetPercent = Math.round((project.spent / project.budget) * 100);
  const completedMilestones = project.milestones.filter((m) => m.completed).length;
  const daysLeft = Math.ceil((new Date(project.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const progressData = [{ value: project.progress, fill: '#4F46E5' }];

  return (
    <div className="flex flex-col h-full">
      <Header
        title={project.name}
        subtitle={project.client}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer text-sm"
              style={{ fontWeight: 500 }}
            >
              <Edit2 className="size-3.5" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all cursor-pointer text-sm"
              style={{ fontWeight: 500 }}
            >
              <Trash2 className="size-3.5" /> Delete
            </button>
          </div>
        }
      />

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer text-sm"
          style={{ fontWeight: 500 }}
        >
          <ArrowLeft className="size-4" /> All Projects
        </button>

        {/* Top cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Progress */}
          <div className="col-span-2 lg:col-span-1 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-5 flex flex-col items-center justify-center">
            <ResponsiveContainer width={100} height={100}>
              <RadialBarChart innerRadius="60%" outerRadius="90%" data={progressData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" background={{ fill: '#f1f5f9' }} cornerRadius={10}>
                  <Cell fill="#4F46E5" />
                </RadialBar>
              </RadialBarChart>
            </ResponsiveContainer>
            <p className="text-slate-900 text-2xl -mt-2" style={{ fontWeight: 800 }}>{project.progress}%</p>
            <p className="text-slate-500 text-xs mt-0.5">Progress</p>
          </div>

          {/* Status */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-5">
            <p className="text-xs text-slate-500 mb-2">Status</p>
            <StatusBadge status={project.status} size="md" />
            <p className="text-xs text-slate-400 mt-2">
              Started {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="size-4 text-slate-400" />
              <p className="text-xs text-slate-500">Due Date</p>
            </div>
            <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>
              {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className={`text-xs mt-1 ${daysLeft < 0 ? 'text-red-500' : daysLeft < 14 ? 'text-amber-500' : 'text-slate-400'}`}>
              {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
            </p>
          </div>

          {/* Budget */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="size-4 text-slate-400" />
              <p className="text-xs text-slate-500">Budget</p>
            </div>
            <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{formatCurrency(project.budget)}</p>
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-400">Spent</span>
                <span className={`text-xs ${budgetPercent > 90 ? 'text-red-500' : 'text-slate-500'}`} style={{ fontWeight: 600 }}>
                  {budgetPercent}%
                </span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${budgetPercent > 90 ? 'bg-red-400' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content: Description + Milestones + Team */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Description + Tags */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-5">
              <h3 className="text-slate-900 mb-3" style={{ fontWeight: 700, fontSize: '0.9rem' }}>About</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg border border-indigo-100" style={{ fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Team */}
            <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="size-4 text-slate-400" />
                <h3 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>Team ({project.team.length})</h3>
              </div>
              <div className="space-y-3">
                {project.team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white shrink-0" style={{ fontSize: '0.6rem', fontWeight: 700 }}>
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-slate-800 text-xs" style={{ fontWeight: 600 }}>{member.name}</p>
                      <p className="text-slate-400 text-xs">{member.role}</p>
                    </div>
                  </div>
                ))}
                {project.team.length === 0 && (
                  <p className="text-slate-400 text-sm">No team members assigned</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Milestones */}
          <div className="lg:col-span-2 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>
                  Milestones
                  <span className="ml-2 text-xs text-slate-400" style={{ fontWeight: 400 }}>
                    {completedMilestones}/{project.milestones.length} completed
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setAddingMilestone(!addingMilestone)}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer text-xs"
                style={{ fontWeight: 600 }}
              >
                <Plus className="size-3.5" /> Add milestone
              </button>
            </div>

            {/* Add milestone form */}
            {addingMilestone && (
              <div className="mb-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 space-y-2">
                <input
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="Milestone title"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-indigo-200 text-slate-800 text-xs outline-none focus:border-indigo-400 transition-all"
                />
                <input
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  placeholder="Description (optional)"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-indigo-200 text-slate-800 text-xs outline-none focus:border-indigo-400 transition-all"
                />
                <input
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-indigo-200 text-slate-800 text-xs outline-none focus:border-indigo-400 transition-all cursor-pointer"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setAddingMilestone(false)}
                    className="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white transition-colors cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMilestone}
                    className="flex-1 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer text-xs"
                    style={{ fontWeight: 600 }}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Milestone list */}
            <div className="space-y-3">
              {project.milestones.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="size-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No milestones yet</p>
                </div>
              ) : (
                project.milestones.map((milestone, i) => (
                  <div
                    key={milestone.id}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${milestone.completed ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                  >
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => completeMilestone(project.id, milestone.id)}
                        className="cursor-pointer transition-transform hover:scale-110 mt-0.5"
                      >
                        {milestone.completed ? (
                          <CheckCircle2 className="size-5 text-emerald-500" />
                        ) : (
                          <Circle className="size-5 text-slate-300 hover:text-indigo-400 transition-colors" />
                        )}
                      </button>
                      {i < project.milestones.length - 1 && (
                        <div className={`w-0.5 h-6 mt-1 ${milestone.completed ? 'bg-emerald-200' : 'bg-slate-100'}`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${milestone.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`} style={{ fontWeight: 600 }}>
                        {milestone.title}
                      </p>
                      {milestone.description && (
                        <p className="text-slate-400 text-xs mt-0.5">{milestone.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="size-3" />
                          {new Date(milestone.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {milestone.completed && milestone.completedAt && (
                          <span className="text-xs text-emerald-600" style={{ fontWeight: 500 }}>
                            ✓ Completed {new Date(milestone.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <EditProjectModal project={editOpen ? project : null} onClose={() => setEditOpen(false)} />
    </div>
  );
}
