import { Activity } from '../hooks/useActivities';
import { 
  FolderKanban, 
  FileText, 
  Receipt, 
  Paperclip, 
  Users,
  CheckCircle,
  Edit,
  Trash2,
  Upload,
  DollarSign
} from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
  showUser?: boolean;
}

const actionIcons: Record<string, any> = {
  created: Edit,
  updated: Edit,
  deleted: Trash2,
  completed: CheckCircle,
  uploaded: Upload,
  invited: Users,
  removed: Trash2,
  status_changed: Edit,
  marked_paid: DollarSign,
};

const entityIcons: Record<string, any> = {
  project: FolderKanban,
  milestone: FileText,
  invoice: Receipt,
  attachment: Paperclip,
  member: Users,
};

export function ActivityFeed({ activities, showUser = true }: ActivityFeedProps) {
  const getUserName = (activity: Activity) => {
    const { user } = activity;
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.username) return user.username;
    return user.email.split('@')[0];
  };

  const getUserInitials = (activity: Activity) => {
    const { user } = activity;
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.username) return user.username.slice(0, 2).toUpperCase();
    return user.email.slice(0, 2).toUpperCase();
  };

  const getActivityMessage = (activity: Activity) => {
    const { action, entityType, entityName, metadata } = activity;
    const name = entityName || 'item';

    switch (action) {
      case 'created':
        return (
          <>
            created {entityType} <span className="font-semibold text-slate-900">"{name}"</span>
          </>
        );
      case 'updated':
        return (
          <>
            updated {entityType} <span className="font-semibold text-slate-900">"{name}"</span>
          </>
        );
      case 'deleted':
        return (
          <>
            deleted {entityType} <span className="font-semibold text-slate-900">"{name}"</span>
          </>
        );
      case 'completed':
        return (
          <>
            completed {entityType} <span className="font-semibold text-slate-900">"{name}"</span>
            {metadata?.projectName && (
              <span className="text-slate-400"> in {metadata.projectName}</span>
            )}
          </>
        );
      case 'uploaded':
        return (
          <>
            uploaded <span className="font-semibold text-slate-900">"{name}"</span>
            {metadata?.projectName && (
              <span className="text-slate-400"> to {metadata.projectName}</span>
            )}
          </>
        );
      case 'marked_paid':
        return (
          <>
            marked invoice <span className="font-semibold text-slate-900">{name}</span> as paid
            {metadata?.total && (
              <span className="text-emerald-600 font-semibold"> (${metadata.total.toFixed(2)})</span>
            )}
          </>
        );
      case 'status_changed':
        return (
          <>
            changed {entityType} <span className="font-semibold text-slate-900">"{name}"</span> status
            {metadata?.oldStatus && metadata?.newStatus && (
              <span className="text-slate-400">
                {' '}from {metadata.oldStatus} to {metadata.newStatus}
              </span>
            )}
          </>
        );
      case 'invited':
        return (
          <>
            invited <span className="font-semibold text-slate-900">{name}</span> to workspace
          </>
        );
      case 'removed':
        return (
          <>
            removed <span className="font-semibold text-slate-900">{name}</span> from workspace
          </>
        );
      default:
        return (
          <>
            {action} {entityType} <span className="font-semibold text-slate-900">"{name}"</span>
          </>
        );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="size-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">No activity yet</p>
        <p className="text-slate-400 text-sm mt-1">
          Activity will appear here as your team works
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const EntityIcon = entityIcons[activity.entityType] || FileText;
        const ActionIcon = actionIcons[activity.action] || Edit;

        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
          >
            {/* User Avatar */}
            {showUser && (
              <div
                className="size-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white shrink-0"
                style={{ fontSize: '0.7rem', fontWeight: 700 }}
              >
                {activity.user.avatarUrl ? (
                  <img
                    src={activity.user.avatarUrl}
                    alt={getUserName(activity)}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getUserInitials(activity)
                )}
              </div>
            )}

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">
                {showUser && (
                  <span className="font-semibold text-slate-900">
                    {getUserName(activity)}{' '}
                  </span>
                )}
                {getActivityMessage(activity)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {formatTime(activity.createdAt)}
              </p>
            </div>

            {/* Entity Icon */}
            <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              <EntityIcon className="size-4 text-slate-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}