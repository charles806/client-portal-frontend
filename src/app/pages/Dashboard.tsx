import { useState } from "react";
import {
  Plus,
  TrendingUp,
  FolderKanban,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { Header } from "../components/layout/Header";
import { StatsCard } from "../components/dashboard/StatsCard";
import { ProjectCard } from "../components/dashboard/ProjectCard";
import { AddProjectModal } from "../components/modals/AddProjectModal";
import { useProjects } from "../hooks/useProjects";
import { useWorkspaceStore } from '../store/workspaceStore';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { activityData, recentActivity } from "../services/dashboardData";

export default function Dashboard() {
  const { user } = useAuth();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { projects, stats } = useProjects(currentWorkspaceId);
  const [addOpen, setAddOpen] = useState(false);

  const activeProjects = projects.filter(
    (p) => p.status === "active" || p.status === "planning",
  );
  const recentProjects = projects.slice(0, 6);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const getDisplayName = () => {
    if (user?.username) return user.username;
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split('@')[0];
    return 'there';
  };


  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
    }).format(n);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle={`${greeting()}, ${getDisplayName()} 👋`}
        action={
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-colors cursor-pointer shadow-md shadow-indigo-200 text-sm"
            style={{ fontWeight: 600 }}
          >
            <Plus className="size-3.5" />
            New Project
          </button>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Projects"
            value={stats.total}
            change="2 added this month"
            changeType="positive"
            icon={FolderKanban}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
          />
          <StatsCard
            title="Active"
            value={stats.active}
            change={`${stats.avgProgress}% avg progress`}
            changeType="neutral"
            icon={TrendingUp}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            change="This quarter"
            changeType="positive"
            icon={CheckCircle}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatsCard
            title="Total Budget"
            value={formatCurrency(stats.totalBudget)}
            change={`${formatCurrency(stats.totalSpent)} spent`}
            changeType="neutral"
            icon={DollarSign}
            iconColor="text-violet-600"
            iconBg="bg-violet-50"
          />
        </div>

        {/* Charts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity chart */}
          <div className="lg:col-span-2 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  className="text-slate-900"
                  style={{ fontWeight: 700, fontSize: "0.95rem" }}
                >
                  Project Activity
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Projects created vs completed over time
                </p>
              </div>
              <span
                className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg border border-indigo-100"
                style={{ fontWeight: 600 }}
              >
                Last 6 months
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient
                    id="colorProjects"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorCompleted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    color: "#0f172a",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="projects"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#colorProjects)"
                  name="Projects"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#colorCompleted)"
                  name="Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/50 p-6">
            <h3
              className="text-slate-900 mb-4"
              style={{ fontWeight: 700, fontSize: "0.95rem" }}
            >
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={`size-2 rounded-full mt-2 shrink-0 ${item.color}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-slate-700 text-xs"
                      style={{ fontWeight: 500 }}
                    >
                      {item.action}
                    </p>
                    <p className="text-slate-400 text-xs truncate">
                      {item.project}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 shrink-0">
                    <Clock className="size-3" />
                    <span className="text-xs">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-slate-900"
              style={{ fontWeight: 700, fontSize: "1rem" }}
            >
              Recent Projects
            </h2>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer text-sm"
              style={{ fontWeight: 600 }}
            >
              <Plus className="size-3.5" /> Add new
            </button>
          </div>

          {recentProjects.length === 0 ? (
            <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-dashed border-slate-300 p-16 text-center">
              <FolderKanban className="size-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4" style={{ fontWeight: 500 }}>
                No projects yet
              </p>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-1.5 mx-auto px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer text-sm"
                style={{ fontWeight: 600 }}
              >
                <Plus className="size-3.5" /> Create your first project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddProjectModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
