import { useState } from 'react';
import { Activity as ActivityIcon, Filter } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useActivities } from '../hooks/useActivities';
import { ActivityFeed } from '../components/ActivityFeed';
import { Spinner } from '../components/ui/ios-spinner';

export default function Activity() {
  const { currentWorkspaceId } = useWorkspaceStore();
  const [entityFilter, setEntityFilter] = useState<string>('');
  const { activities, isLoading } = useActivities(currentWorkspaceId, {
    entityType: entityFilter || undefined,
    limit: 50,
  });

  const entityTypes = ['project', 'milestone', 'invoice', 'attachment', 'member'];

  return (
    <div className="flex flex-col h-full">
      <Header title="Activity Feed" subtitle="See what's happening in your workspace" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Filters */}
          <div className="mb-6 flex items-center gap-3">
            <Filter className="size-5 text-slate-400" />
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setEntityFilter('')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  entityFilter === ''
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {entityTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setEntityFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                    entityFilter === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}s
                </button>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <ActivityFeed activities={activities} showUser={true} />
          )}
        </div>
      </div>
    </div>
  );
}