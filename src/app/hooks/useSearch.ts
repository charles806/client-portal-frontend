import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api';

export interface SearchResult {
  id: string;
  type: 'project' | 'milestone' | 'invoice' | 'attachment';
  title: string;
  subtitle: string;
  url: string;
  meta: string | null;
}

export function useSearch(query: string, workspaceId: string | null) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery, workspaceId],
    queryFn: async () => {
      if (!debouncedQuery || !workspaceId) {
        return { results: [] };
      }
      const response = await apiClient.get('/search', {
        params: { q: debouncedQuery, workspaceId }
      });
      return response.data;
    },
    enabled: debouncedQuery.length > 0 && !!workspaceId,
  });

  return {
    results: (data?.results || []) as SearchResult[],
    isLoading,
  };
}