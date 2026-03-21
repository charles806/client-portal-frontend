import { useRef, useState } from 'react';
import { Building2, Upload, X } from 'lucide-react';
import { useUpload } from '../hooks/useUpload';
import { Spinner } from './ui/ios-spinner';

interface LogoUploadProps {
  currentUrl?: string;
  workspaceId: string;
  onUploadComplete: (url: string) => void;
}

export function LogoUpload({ currentUrl, workspaceId, onUploadComplete }: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { uploadWorkspaceLogo, isUploading } = useUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be less than 5MB');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    try {
      const result = await uploadWorkspaceLogo({ file, workspaceId });
      onUploadComplete(result.url);
      setPreview(null);
    } catch (error) {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    onUploadComplete('');
    setPreview(null);
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className="size-24 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-dashed border-indigo-200 flex items-center justify-center relative group cursor-pointer hover:border-indigo-400 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Spinner size="md" />
        ) : preview || currentUrl ? (
          <>
            <img src={preview || currentUrl} alt="Logo" className="w-full h-full object-contain p-2" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="size-6 text-white" />
            </div>
          </>
        ) : (
          <Building2 className="size-8 text-indigo-300" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold"
          >
            {currentUrl ? 'Change Logo' : 'Upload Logo'}
          </button>
          {currentUrl && (
            <button
              onClick={handleRemove}
              className="size-9 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <p className="text-slate-500 text-xs mt-2">
          PNG, JPG or SVG. Max 5MB. Recommended: 400x400px
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}