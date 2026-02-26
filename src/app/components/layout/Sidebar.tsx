import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  FolderKanban,
  CalendarRange,
  Receipt,
  Settings,
  ChevronRight,
  Zap,
  HelpCircle,
  Bell,
} from "lucide-react";
import { Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/timeline", label: "Timeline", icon: CalendarRange },
  { to: "/invoices", label: "Invoices", icon: Receipt },
  { to: "/settings", label: "Settings", icon: Settings },
];

const avatarColors = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

export function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`w-60 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-100">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span
            className="text-gray-900 tracking-tight"
            style={{ fontWeight: 700, fontSize: "15px" }}
          >
            ClientPortal
          </span>
        </div>

        {/* Client Selector */}
        <div className="px-3 pt-4 pb-2">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span
                className="text-white"
                style={{ fontSize: "10px", fontWeight: 600 }}
              >
                MF
              </span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p
                className="text-gray-900 truncate"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                Meridian Financial
              </p>
            </div>
            <ChevronRight
              size={14}
              className="text-gray-400 group-hover:text-gray-600 flex-shrink-0"
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <p
            className="px-3 pb-2 pt-1 text-gray-400 uppercase tracking-wider"
            style={{ fontSize: "11px", fontWeight: 600 }}
          >
            Menu
          </p>
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const isActive = exact
              ? location.pathname === to
              : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon
                  size={16}
                  className={
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                />
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Upgrade Banner */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
            <p className="font-semibold text-sm mb-1">Upgrade to Pro</p>
            <p className="text-xs opacity-90 mb-3">Get unlimited projects</p>
            <button className="w-full bg-white text-indigo-600 rounded-lg py-1.5 text-sm font-medium hover:bg-indigo-50 transition-colors cursor-pointer">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* Recent Clients */}
        <div className="px-3 py-3 border-t border-gray-100">
          <p
            className="px-3 pb-2 text-gray-400 uppercase tracking-wider"
            style={{ fontSize: "11px", fontWeight: 600 }}
          >
            Recent Clients
          </p>
          {[
            { name: "GlobalTrade Corp", initial: "GT", status: "active" },
            { name: "Vertex Solutions", initial: "VS", status: "at-risk" },
            { name: "RetailMax Group", initial: "RM", status: "completed" },
          ].map((client, i) => (
            <button
              key={client.name}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${avatarColors[i]}`}
              >
                <span style={{ fontSize: "10px", fontWeight: 600 }}>
                  {client.initial}
                </span>
              </div>
              <span
                className="text-gray-600 text-left truncate"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                {client.name}
              </span>
              <div
                className={`ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  client.status === "active"
                    ? "bg-emerald-500"
                    : client.status === "at-risk"
                      ? "bg-red-500"
                      : "bg-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="px-3 pb-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
              <Bell size={15} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
              <HelpCircle size={15} />
            </button>
          </div>
          {/* User */}
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span
                className="text-white"
                style={{ fontSize: "11px", fontWeight: 600 }}
              >
                JD
              </span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p
                className="text-gray-900 truncate"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                Jamie Dawson
              </p>
              <p
                className="text-gray-400 truncate"
                style={{ fontSize: "11px" }}
              >
                Account Manager
              </p>
            </div>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
