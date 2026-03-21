import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { toast } from 'sonner';

export interface Subscription {
  id: string;
  status: string;
  planTier: string | null;
  trialEndsAt: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  daysRemaining: number | null;
  usage: {
    projects: number;
    members: number;
    invoices: number;
    limits: {
      workspaces: number;
      projects: number;
      members: number;
      invoices: number;
      storage: number;
    };
  };
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paystackRef: string | null;
  description: string | null;
  createdAt: string;
}

export function useSubscription(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get(`/subscription/status?workspaceId=${workspaceId}`);
      return response.data;
    },
    enabled: !!workspaceId,
  });

  const initializeTrial = useMutation({
    mutationFn: async (data: { workspaceId: string; planTier?: string }) => {
      const response = await apiClient.post('/subscription/initialize', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', workspaceId] });
      toast.success('Trial started successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to start trial');
    },
  });

  const authorizeCard = useMutation({
    mutationFn: async (data: { workspaceId: string; authorizationCode: string }) => {
      const response = await apiClient.post('/subscription/authorize-card', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', workspaceId] });
      toast.success('Card authorized successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to authorize card');
    },
  });

  const upgradePlan = useMutation({
    mutationFn: async (data: { workspaceId: string; newPlanTier: string }) => {
      const response = await apiClient.post('/subscription/upgrade', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', workspaceId] });
      toast.success('Plan upgraded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to upgrade plan');
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.post('/subscription/cancel', { workspaceId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', workspaceId] });
      toast.success('Subscription cancelled');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to cancel subscription');
    },
  });

  const checkLimits = async (feature: string, count = 1) => {
    if (!workspaceId) return { allowed: false, limit: 0, currentCount: 0 };
    
    try {
      const response = await apiClient.post('/subscription/check-limits', {
        workspaceId,
        feature,
        count,
      });
      return response.data;
    } catch (error: any) {
      return { 
        allowed: error.response?.status !== 403, 
        limit: 0, 
        currentCount: 0,
        error: error.response?.data?.error 
      };
    }
  };

  return {
    subscription: subscription as Subscription | undefined,
    isLoading,
    initializeTrial: initializeTrial.mutateAsync,
    authorizeCard: authorizeCard.mutateAsync,
    upgradePlan: upgradePlan.mutateAsync,
    cancelSubscription: cancelSubscription.mutateAsync,
    checkLimits,
  };
}

export function usePaymentHistory(workspaceId: string | undefined) {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['paymentHistory', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get(`/subscription/payment-history?workspaceId=${workspaceId}`);
      return response.data.payments as Payment[];
    },
    enabled: !!workspaceId,
  });

  return { payments, isLoading };
}