import { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router';
import { useAuth } from '@clerk/clerk-react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useWorkspaceStore } from '../store/workspaceStore';
import { Spinner } from './ui/ios-spinner';


export function OnboardingGuard() {
  const { isSignedIn, isLoaded } = useAuth();
  const { workspaces, isLoading } = useWorkspaces();
  const { currentWorkspaceId, setCurrentWorkspace } = useWorkspaceStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isLoading && workspaces.length > 0) {
      // Auto-select first workspace if none selected
      if (!currentWorkspaceId) {
        setCurrentWorkspace(workspaces[0].id);
      }
    }
  }, [isLoaded, isLoading, workspaces, currentWorkspaceId, setCurrentWorkspace]);

  // Wait for auth and workspaces to load
  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/signin" replace />;
  }

  // Redirect to onboarding if no workspaces
  if (workspaces.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}