import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useWorkspaceStore } from '../store/workspaceStore';

export function OnboardingGuard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { workspaces, isLoading: workspacesLoading } = useWorkspaces();
  const { currentWorkspaceId, setCurrentWorkspace } = useWorkspaceStore();

  useEffect(() => {
    if (!authLoading && !workspacesLoading && workspaces.length > 0) {
      if (!currentWorkspaceId) {
        setCurrentWorkspace(workspaces[0].id);
      }
    }
  }, [authLoading, workspacesLoading, workspaces, currentWorkspaceId, setCurrentWorkspace]);

  if (authLoading || workspacesLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100">
        <div className="text-center">
          <div className="size-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (workspaces.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}