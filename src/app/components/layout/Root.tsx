import { Outlet, Navigate, useLocation } from 'react-router';
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
 * For routes that ONLY need authentication (NOT workspace)
 * Used for: /onboarding, /setup-account
 */
export function AuthOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}

/**
 * For routes that require auth AND workspace (e.g. Dashboard)
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { workspaces, isLoading: workspacesLoading } = useWorkspaces();

  console.log('=== PROTECTED ROUTE ===');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('authLoading:', authLoading);
  console.log('workspaces:', workspaces);
  console.log('workspacesLoading:', workspacesLoading);
  console.log('======================');

  if (authLoading || workspacesLoading) {
    console.log('⏳ Loading...');
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to /signin');
    return <Navigate to="/signin" replace />;
  }

  if (workspaces.length === 0) {
    console.log('⚠️ No workspaces, redirecting to /onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  console.log('✅ Authenticated with workspaces, showing protected content');
  return <Outlet />;
}

/**
 * For routes that should NOT be accessible when logged in (e.g. Login, Signup)
 */
export function PublicRoute() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}