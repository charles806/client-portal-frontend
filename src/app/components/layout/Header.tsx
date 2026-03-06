import { Bell, Search, Plus, Menu } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useThemeStore } from '../../store/themeStore';
import { useProjectStore } from '../../store/projectStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const { user } = useAuth();
  const { toggleSidebar } = useThemeStore();
  const { projects } = useProjectStore();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const filteredProjects = searchQuery
    ? projects.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const notifications = [
    { id: 1, text: 'Client Portal Redesign milestone completed', time: '2h ago', unread: true },
    { id: 2, text: 'Invoice #INV-2024 is due in 3 days', time: '5h ago', unread: true },
    { id: 3, text: 'New team member invited to workspace', time: '1d ago', unread: false },
  ];

  // Get user initials
  const getInitials = () => {
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        {/* <button
          onClick={toggleSidebar}
          className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer lg:hidden"
        >
          <Menu className="size-4" />
        </button> */}
        <div className="min-w-0">
          <h1 className="text-slate-900 truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none" style={{ fontWeight: 700, fontSize: '1.125rem' }}>
            {title}
          </h1>
          {subtitle && <p className="text-slate-500 text-xs mt-0.5 truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer text-sm"
          >
            <Search className="size-3.5" />
            {searchOpen ? (
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none w-20 sm:w-40 text-slate-700 placeholder:text-slate-400"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="hidden sm:inline" style={{ fontSize: '0.8rem' }}>Search...</span>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 text-slate-400" style={{ fontSize: '0.65rem' }}>
              ⌘K
            </kbd>
          </button>

          {searchOpen && searchQuery && filteredProjects.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
              {filteredProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { navigate(`/projects/${p.id}`); setSearchOpen(false); setSearchQuery(''); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors cursor-pointer text-left"
                >
                  <div className="size-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
                    {p.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-slate-800 text-sm" style={{ fontWeight: 500 }}>{p.name}</p>
                    <p className="text-slate-400 text-xs">{p.client}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative size-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-indigo-600 rounded-full" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Notifications</p>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${n.unread ? 'bg-indigo-50/50' : ''}`}
                >
                  {n.unread && <span className="size-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />}
                  {!n.unread && <span className="size-1.5 mt-1.5 shrink-0" />}
                  <div>
                    <p className="text-slate-700 text-xs leading-relaxed">{n.text}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action slot */}
        {action}

        {/* Avatar */}
        <div
          onClick={() => navigate('/settings')}
          className="size-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white cursor-pointer hover:shadow-md hover:shadow-indigo-300/40 transition-all"
          style={{ fontSize: '0.7rem', fontWeight: 700 }}
        >
          {getInitials()}
        </div>
      </div>
    </header>
  );
}