import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { useThemeStore } from '../../store/themeStore';
import { useState, useEffect, createContext, useContext } from 'react';
import { SearchModal } from '../SearchModal';

// Create Search Context
interface SearchContextType {
    openSearch: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within AppLayout');
    }
    return context;
}

export function AppLayout() {
    const { sidebarCollapsed } = useThemeStore();
    const [searchOpen, setSearchOpen] = useState(false);

    // Cmd+K / Ctrl+K keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <SearchContext.Provider value={{ openSearch: () => setSearchOpen(true) }}>
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

                {/* Search Modal */}
                <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            </div>
        </SearchContext.Provider>
    );
}