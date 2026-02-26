import { Search, Bell, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useProjectStore } from "../../../store/projectStore";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { searchQuery, setSearchQuery } = useProjectStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      <div className="min-w-0">
        <h1
          className="text-gray-900 truncate"
          style={{ fontSize: "16px", fontWeight: 600, lineHeight: 1.4 }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-gray-400 truncate"
            style={{ fontSize: "12px", fontWeight: 400 }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search */}
        <div className="hidden md:flex items-center relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-50 transition-all duration-200"
            style={{ fontSize: "13px" }}
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>

          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <button className="text-xs text-indigo-600 cursor-pointer">
                    Mark all read
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {[
                    {
                      text: "New comment on Enterprise CRM",
                      time: "2 min ago",
                      unread: true,
                    },
                    {
                      text: "Project milestone completed",
                      time: "1 hour ago",
                      unread: true,
                    },
                    {
                      text: "Invoice payment received",
                      time: "3 hours ago",
                      unread: false,
                    },
                  ].map((notif, i) => (
                    <div
                      key={i}
                      className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notif.unread ? "bg-indigo-50/30" : ""}`}
                    >
                      <p className="text-sm font-medium">{notif.text}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {notif.time}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-3 text-center">
                  <button className="text-sm text-indigo-600 cursor-pointer">
                    View all
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200" />

        {/* Custom Actions */}
        {actions}

        {/* Default CTA */}
        {!actions && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg transition-colors duration-150 shadow-sm">
            <Plus size={14} />
            <span style={{ fontSize: "13px", fontWeight: 500 }}>
              New Project
            </span>
          </button>
        )}

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-3 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-r-lg transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
              <span
                className="text-white"
                style={{ fontSize: "11px", fontWeight: 600 }}
              >
                JD
              </span>
            </div>
            <ChevronDown size={13} className="text-gray-400" />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-sm">Jamie Dawson</p>
                  <p className="text-xs text-gray-500">jamie@example.com</p>
                </div>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                >
                  <User size={16} className="text-gray-400" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                >
                  <Settings size={16} className="text-gray-400" />
                  Settings
                </button>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 cursor-pointer text-sm text-red-600">
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
