import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { toast } from 'sonner';

export interface Attachment {
  id: string;
  projectId: string;
  uploadedBy: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  publicId: string;
  createdAt: string;
}

export function useAttachments(projectId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['attachments', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${projectId}/attachments`);
      return response.data;
    },
    enabled: !!projectId,
  });

  const uploadAttachment = useMutation({
    mutationFn: async ({ file, projectId }: { file: File; projectId: string }) => {
      // First upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);

      const uploadResponse = await apiClient.post('/upload/project-attachment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Then save to database
      const { url, publicId, fileName, fileSize, mimeType } = uploadResponse.data;
      
      const dbResponse = await apiClient.post(`/projects/${projectId}/attachments`, {
        fileName,
        fileUrl: url,
        fileSize,
        mimeType,
        publicId,
      });

      return dbResponse.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
      toast.success('File uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Upload failed');
    },
  });

  const deleteAttachment = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/attachments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
      toast.success('File deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Delete failed');
    },
  });

  return {
    attachments,
    isLoading,
    uploadAttachment: uploadAttachment.mutateAsync,
    deleteAttachment: deleteAttachment.mutateAsync,
    isUploading: uploadAttachment.isPending,
  };
}