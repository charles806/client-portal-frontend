import { Outlet, Navigate } from 'react-router';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Spinner } from '../ui/ios-spinner';


export function Root() {
  return <Outlet />;
}

export function ProtectedRoute() {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for Clerk to load
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );

  }

  if (!isSignedIn) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );

  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}