import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  FolderKanban,
  GitBranch,
  FileText,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react";
import { useThemeStore } from "../../store/themeStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { toast } from "sonner";
import { useUser, useClerk } from "@clerk/clerk-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: FolderKanban, label: "Projects", to: "/projects" },
  { icon: GitBranch, label: "Timeline", to: "/timeline" },
  { icon: FileText, label: "Invoices", to: "/invoices" },
];

const bottomItems = [
  { icon: Building2, label: "Workspace", to: "/workspace" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useThemeStore();
  const { workspace } = useWorkspaceStore();
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut(() => navigate("/"));
    toast.success("Logged out successfully");
  };

  return (
    <aside
      className={`relative flex flex-col h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-60"}`}
      style={{ flexShrink: 0 }}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-16 px-4 border-b border-slate-800 ${sidebarCollapsed ? "justify-center" : "gap-3"}`}
      >
        <div className="size-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
          <Zap className="size-4 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p
              className="text-white truncate"
              style={{ fontWeight: 700, fontSize: "0.9rem" }}
            >
              {workspace.name}
            </p>
            <p
              className="text-indigo-400 capitalize"
              style={{ fontSize: "0.7rem" }}
            >
              {workspace.plan} plan
            </p>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 size-6 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors z-10 cursor-pointer"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="size-3.5" />
        ) : (
          <ChevronLeft className="size-3.5" />
        )}
      </button>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 cursor-pointer group ${isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${sidebarCollapsed ? "justify-center" : ""}`
            }
            title={sidebarCollapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`shrink-0 ${sidebarCollapsed ? "size-5" : "size-4.5"} ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                />
                {!sidebarCollapsed && (
                  <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {!sidebarCollapsed && (
          <div className="pt-4 mt-2 border-t border-slate-800">
            <p
              className="text-slate-600 px-3 mb-2"
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Settings
            </p>
          </div>
        )}
        {sidebarCollapsed && <div className="border-t border-slate-800 my-2" />}

        {bottomItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 cursor-pointer group ${isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${sidebarCollapsed ? "justify-center" : ""}`
            }
            title={sidebarCollapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`shrink-0 ${sidebarCollapsed ? "size-5" : "size-4.5"} ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                />
                {!sidebarCollapsed && (
                  <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div
        className={`p-3 border-t border-slate-800 ${sidebarCollapsed ? "flex justify-center" : ""}`}
      >
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors group">
            <div
              className="size-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white shrink-0"
              style={{ fontSize: "0.7rem", fontWeight: 700 }}
            >
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) ?? "AM"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p
                className="text-white truncate"
                style={{ fontWeight: 500, fontSize: "0.8rem" }}
              >
                {user?.name ?? "Alex Morgan"}
              </p>
              <p
                className="text-slate-500 truncate"
                style={{ fontSize: "0.7rem" }}
              >
                {user?.role ?? "Owner"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              title="Logout"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="size-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="size-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}
