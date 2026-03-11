import { useMutation } from '@tanstack/react-query';
import apiClient from '../services/api';
import { toast } from 'sonner';

export function useUpload() {
    const uploadAvatar = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiClient.post('/upload/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Avatar uploaded!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Upload failed');
        },
    });

    const uploadWorkspaceLogo = useMutation({
        mutationFn: async ({ file, workspaceId }: { file: File; workspaceId: string }) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('workspaceId', workspaceId);

            const response = await apiClient.post('/upload/workspace-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Logo uploaded!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Upload failed');
        },
    });

    return {
        uploadAvatar: uploadAvatar.mutateAsync,
        uploadWorkspaceLogo: uploadWorkspaceLogo.mutateAsync,
        isUploading: uploadAvatar.isPending || uploadWorkspaceLogo.isPending,
    };
}