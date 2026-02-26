import { useState } from "react";
import {
  DollarSign,
  FolderOpen,
  FileText,
  Star,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Header } from "../components/layout/Header";
import { MetricCard } from "../components/ui/MetricCard";
import { ProjectCard } from "../components/ui/ProjectCard";
import { ActivityFeed } from "../components/ui/ActivityFeed";
import { StatusBadge } from "../components/ui/StatusBadge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { projects, activities, stats, milestones } from "../data/mockData";
import { useNavigate } from "react-router";

export function Dashboard() {
  const navigate = useNavigate();
  const [loadingDemo, setLoadingDemo] = useState(false);
  const activeProjects = projects.filter((p) => p.status === "active");
  const atRiskProjects = projects.filter((p) => p.status === "at-risk");
  const upcomingMilestones = milestones
    .filter((m) => m.status === "upcoming" || m.status === "in-progress")
    .slice(0, 3);

  const handleDemoLoading = () => {
    setLoadingDemo(true);
    setTimeout(() => setLoadingDemo(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" subtitle="Tuesday, February 24, 2026" />
      <div className="p-6 space-y-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            label="Total Revenue"
            value={stats.totalRevenue}
            change={stats.revenueGrowth}
            changePositive
            icon={<DollarSign size={16} className="text-emerald-600" />}
            iconBg="bg-emerald-50"
            description="vs. last quarter"
          />
          <MetricCard
            label="Active Projects"
            value={String(stats.activeProjects)}
            change={stats.projectsGrowth}
            changePositive
            icon={<FolderOpen size={16} className="text-indigo-600" />}
            iconBg="bg-indigo-50"
            description="across 4 clients"
          />
          <MetricCard
            label="Pending Invoices"
            value={stats.pendingInvoices}
            change="3 invoices"
            changePositive={false}
            icon={<FileText size={16} className="text-amber-600" />}
            iconBg="bg-amber-50"
            description="requires attention"
          />
          <MetricCard
            label="Client Satisfaction"
            value={stats.clientSatisfaction}
            change={stats.satisfactionChange}
            changePositive
            icon={<Star size={16} className="text-violet-600" />}
            iconBg="bg-violet-50"
            description="avg CSAT score"
          />
        </div>

        {/* Alert Banner */}
        {atRiskProjects.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={15} className="text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-red-800"
                style={{ fontSize: "13px", fontWeight: 600 }}
              >
                {atRiskProjects.length} project
                {atRiskProjects.length > 1 ? "s" : ""} require
                {atRiskProjects.length === 1 ? "s" : ""} attention
              </p>
              <p className="text-red-600" style={{ fontSize: "12px" }}>
                {atRiskProjects.map((p) => p.name).join(", ")} — review timeline
                and resources
              </p>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex-shrink-0"
              style={{ fontSize: "12px", fontWeight: 500 }}
              onClick={() => navigate("/projects")}
            >
              View Projects <ArrowRight size={12} />
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects - takes full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2
                className="text-gray-900"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Active Projects
              </h2>
              <button
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors"
                style={{ fontSize: "12.5px", fontWeight: 500 }}
                onClick={() => navigate("/projects")}
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="relative">
                  <ProjectCard
                    project={project}
                    onView={() => navigate("/projects")}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Upcoming Milestones */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-gray-900"
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  Upcoming Milestones
                </h2>
                <button
                  className="text-indigo-600 hover:text-indigo-700 transition-colors"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                  onClick={() => navigate("/timeline")}
                >
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {upcomingMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div
                      className={`mt-0.5 flex-shrink-0 ${
                        milestone.status === "in-progress"
                          ? "text-indigo-500"
                          : "text-gray-300"
                      }`}
                    >
                      {milestone.status === "in-progress" ? (
                        <Clock size={14} />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-gray-800 truncate"
                        style={{ fontSize: "12.5px", fontWeight: 500 }}
                      >
                        {milestone.title}
                      </p>
                      <p
                        className="text-gray-400 truncate mt-0.5"
                        style={{ fontSize: "11px" }}
                      >
                        {milestone.projectName} · {milestone.date}
                      </p>
                    </div>
                    <StatusBadge status={milestone.status} />
                  </div>
                ))}
              </div>
              <button
                className="w-full mt-3 py-2 rounded-lg border border-dashed border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
                style={{ fontSize: "12px", fontWeight: 500 }}
                onClick={() => navigate("/timeline")}
              >
                + View Timeline
              </button>
            </div>

            {/* Project Overview */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2
                className="text-gray-900 mb-4"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Portfolio Overview
              </h2>
              <div className="space-y-3">
                {projects.slice(0, 4).map((project) => (
                  <div key={project.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className="text-gray-700 truncate"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                        >
                          {project.name}
                        </p>
                        <span
                          className="text-gray-500 ml-2 flex-shrink-0"
                          style={{ fontSize: "11px" }}
                        >
                          {project.progress}%
                        </span>
                      </div>
                      <ProgressBar
                        value={project.progress}
                        status={project.status}
                        showLabel={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          {/* Recent Activity - full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <h2
                className="text-gray-900"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Recent Activity
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                style={{ fontSize: "12px" }}
              >
                Mark all read
              </button>
            </div>
            <ActivityFeed activities={activities} />
          </div>

          {/* Quick Actions / Loading Demo */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2
                className="text-gray-900 mb-4"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  {
                    label: "Create New Project",
                    color:
                      "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-200",
                  },
                  {
                    label: "Generate Invoice",
                    color:
                      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
                  },
                  {
                    label: "Schedule Review",
                    color:
                      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
                  },
                  {
                    label: "Upload Document",
                    color:
                      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
                  },
                ].map((action) => (
                  <button
                    key={action.label}
                    className={`w-full px-4 py-2.5 rounded-lg transition-all duration-150 text-left ${action.color}`}
                    style={{ fontSize: "13px", fontWeight: 500 }}
                    onClick={handleDemoLoading}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State Demo */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-gray-900"
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  System Status
                </h2>
                <span
                  className="flex items-center gap-1.5 text-emerald-600"
                  style={{ fontSize: "11px", fontWeight: 500 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  All systems operational
                </span>
              </div>
              {loadingDemo ? (
                <div className="space-y-2.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="h-3 bg-gray-100 rounded animate-pulse"
                        style={{ width: `${60 + i * 15}%` }}
                      />
                    </div>
                  ))}
                  <div className="flex items-center justify-center py-2">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {[
                    { name: "API Response Time", value: "142ms", ok: true },
                    { name: "Uptime", value: "99.98%", ok: true },
                    { name: "Error Rate", value: "0.02%", ok: true },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <span
                        className="text-gray-500"
                        style={{ fontSize: "12px" }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="text-emerald-600"
                        style={{ fontSize: "12px", fontWeight: 600 }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
