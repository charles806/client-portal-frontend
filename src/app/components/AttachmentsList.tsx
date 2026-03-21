import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useRef, useState } from 'react';
import { Paperclip, Download, Trash2, Upload, File, Image, FileText } from 'lucide-react';
import { useAttachments, Attachment } from '../hooks/useAttachments';
import { Spinner } from './ui/ios-spinner';

interface AttachmentsListProps {
    projectId: string;
}

export function AttachmentsList({ projectId }: AttachmentsListProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { attachments, isLoading, uploadAttachment, deleteAttachment, isUploading } = useAttachments(projectId);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size
        if (file.size > 5 * 1024 * 1024) {
            alert('File must be less than 5MB');
            return;
        }

        try {
            await uploadAttachment({ file, projectId });
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const handleDelete = async (id: string, fileName: string) => {
        if (!confirm(`Delete ${fileName}?`)) return;

        setDeletingId(id);
        try {
            await deleteAttachment(id);
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <Image className="size-5 text-blue-500" />;
        if (mimeType.includes('pdf')) return <FileText className="size-5 text-red-500" />;
        return <File className="size-5 text-slate-400" />;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Spinner size="md" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Paperclip className="size-5 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Attachments</h3>
                    <span className="text-sm text-slate-500">({attachments.length})</span>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-semibold disabled:opacity-50"
                >
                    {isUploading ? <Spinner size="sm" /> : <Upload className="size-4" />}
                    Upload File
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
            />

            {attachments.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Paperclip className="size-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No attachments yet</p>
                    <p className="text-slate-400 text-sm mt-1">Upload files to share with your team</p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-semibold"
                    >
                        Upload File
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {attachments.map((attachment: Attachment) => (
                        <div
                            key={attachment.id}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors group"
                        >
                            <div className="shrink-0">
                                {getFileIcon(attachment.mimeType)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                    {attachment.fileName}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {formatFileSize(attachment.fileSize)} • {new Date(attachment.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={attachment.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="size-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                                    title="Download"
                                >
                                    <Download className="size-4" />
                                </a>
                                <button
                                    onClick={() => handleDelete(attachment.id, attachment.fileName)}
                                    disabled={deletingId === attachment.id}
                                    className="size-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors text-slate-400 hover:text-red-600 disabled:opacity-50"
                                    title="Delete"
                                >
                                    {deletingId === attachment.id ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        <Trash2 className="size-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
}