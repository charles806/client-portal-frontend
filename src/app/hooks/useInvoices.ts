import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { toast } from 'sonner';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceItem {
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    workspaceId: string;
    projectId?: string;
    clientName: string;
    clientEmail?: string;
    clientAddress?: string;
    issueDate: string;
    dueDate: string;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discount: number;
    total: number;
    status: InvoiceStatus;
    notes?: string;
    terms?: string;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
    items: InvoiceItem[];
    project?: {
        id: string;
        name: string;
        clientName?: string;
    };
    workspace?: {
        id: string;
        name: string;
    };
    _count?: {
        items: number;
    };
}

export interface CreateInvoiceData {
    workspaceId: string;
    projectId?: string;
    clientName: string;
    clientEmail?: string;
    clientAddress?: string;
    issueDate?: string;
    dueDate: string;
    taxRate?: number;
    discount?: number;
    notes?: string;
    terms?: string;
    items: InvoiceItem[];
}

export interface UpdateInvoiceData {
    clientName?: string;
    clientEmail?: string;
    clientAddress?: string;
    issueDate?: string;
    dueDate?: string;
    taxRate?: number;
    discount?: number;
    notes?: string;
    terms?: string;
    items?: InvoiceItem[];
}

export function useInvoices(workspaceId: string | undefined, filters?: { status?: InvoiceStatus; projectId?: string }) {
    const queryClient = useQueryClient();

    const { data: invoices = [], isLoading } = useQuery({
        queryKey: ['invoices', workspaceId, filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (workspaceId) params.append('workspaceId', workspaceId);
            if (filters?.status) params.append('status', filters.status);
            if (filters?.projectId) params.append('projectId', filters.projectId);

            const response = await apiClient.get(`/invoices?${params.toString()}`);
            return response.data;
        },
        enabled: !!workspaceId,
    });

    const createInvoice = useMutation({
        mutationFn: async (data: CreateInvoiceData) => {
            const response = await apiClient.post('/invoices', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            toast.success('Invoice created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to create invoice');
        },
    });

    const updateInvoice = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateInvoiceData }) => {
            const response = await apiClient.patch(`/invoices/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            toast.success('Invoice updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update invoice');
        },
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: InvoiceStatus }) => {
            const response = await apiClient.patch(`/invoices/${id}/status`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            toast.success('Invoice status updated!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update status');
        },
    });

    const deleteInvoice = useMutation({
        mutationFn: async (id: string) => {
            const response = await apiClient.delete(`/invoices/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            toast.success('Invoice deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to delete invoice');
        },
    });

    return {
        invoices,
        isLoading,
        createInvoice: createInvoice.mutateAsync,
        updateInvoice: updateInvoice.mutateAsync,
        updateStatus: updateStatus.mutateAsync,
        deleteInvoice: deleteInvoice.mutateAsync,
    };
}

export function useInvoice(id: string | undefined) {
    return useQuery<Invoice>({
        queryKey: ['invoices', id],
        queryFn: async () => {
            const response = await apiClient.get(`/invoices/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}