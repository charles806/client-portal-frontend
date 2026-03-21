import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api';

export interface Activity {
  id: string;
  userId: string;
  workspaceId: string;
  action: string;
  entityType: string;
  entityId: string | null;
  entityName: string | null;
  metadata: Record<string, any>;
  createdAt: string;
  user: {
    id: string;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

interface UseActivitiesOptions {
  entityType?: string;
  userId?: string;
  limit?: number;
}

export function useActivities(workspaceId: string | null, options?: UseActivitiesOptions) {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities', workspaceId, options],
    queryFn: async () => {
      const params: any = { workspaceId };
      if (options?.entityType) params.entityType = options.entityType;
      if (options?.userId) params.userId = options.userId;
      if (options?.limit) params.limit = options.limit;

      const response = await apiClient.get('/activities', { params });
      return response.data;
    },
    enabled: !!workspaceId,
  });

  return {
    activities: activities as Activity[],
    isLoading,
  };
}