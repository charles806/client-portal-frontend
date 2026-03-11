import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { useThemeStore } from '../../store/themeStore';

export function AppLayout() {
    const { sidebarCollapsed } = useThemeStore();

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 overflow-hidden">
            <Sidebar />

            {/* Overlay for mobile */}
            {!sidebarCollapsed && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => useThemeStore.getState().toggleSidebar()}
                />
            )}

            {/* Main content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}