import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { Spinner } from '../ui/ios-spinner';

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100">
      <div className="text-center">
        <div className="size-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <div className="text-slate-600 text-sm flex items-center justify-center gap-2">
          <Spinner size="lg" />
          <span>Loading...</span>
        </div>
      </div>
    </div>
  );
}

export function Root() {
  return <Outlet />;
}

/**
 * For routes that require auth AND onboarding completion (e.g. Dashboard)
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  // Only fetch workspaces if authenticated
  const { workspaces, isLoading: workspacesLoading } = useWorkspaces({ enabled: isAuthenticated });

  if (authLoading || (isAuthenticated && workspacesLoading)) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (workspaces.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

/**
 * For routes that require auth but NOT onboarding completion (e.g. Onboarding itself)
 */
export function AuthenticatedRoute() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}

/**
 * For routes that should NOT be accessible when logged in (e.g. Login, Signup, Landing)
 */
export function PublicRoute() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  // Only fetch workspaces if authenticated to prevent 401 on landing
  const { workspaces, isLoading: workspacesLoading } = useWorkspaces({ enabled: isAuthenticated });

  if (authLoading || (isAuthenticated && workspacesLoading)) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    if (workspaces.length === 0) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}