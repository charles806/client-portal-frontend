import { Navigate } from "react-router";
import { useWorkspaceStore } from "../store/workspaceStore";
import { useSubscription } from "../hooks/useSubscription";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { currentWorkspaceId } = useWorkspaceStore();
  const { subscription, isLoading } = useSubscription(currentWorkspaceId);

  // If still loading, show nothing
  if (isLoading) {
    return null;
  }

  // If no workspace, let them through (onboarding will handle)
  if (!currentWorkspaceId) {
    return <>{children}</>;
  }

  // If subscription exists with auth code (card added), allow access
  if (subscription && subscription.status === 'ACTIVE') {
    return <>{children}</>;
  }

  // If trial but no card - redirect to billing to add payment
  if (subscription && subscription.status === 'TRIALING') {
    // Allow trial access without card for now - but you can enable strict mode below
    // return <Navigate to={`/workspace-settings?workspace=${currentWorkspaceId}&tab=billing`} replace />;
    return <>{children}</>;
  }

  // No subscription or expired - redirect to billing
  return <Navigate to={`/workspace-settings?workspace=${currentWorkspaceId}&tab=billing`} replace />;
}
