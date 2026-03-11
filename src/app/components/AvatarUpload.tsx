import { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { useUpload } from '../hooks/useUpload';
import { Spinner } from './ui/ios-spinner';

interface AvatarUploadProps {
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarUpload({ currentUrl, onUploadComplete, size = 'md' }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { uploadAvatar, isUploading } = useUpload();

  const sizeClasses = {
    sm: 'size-16',
    md: 'size-24',
    lg: 'size-32',
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    try {
      const result = await uploadAvatar(file);
      onUploadComplete(result.url);
      setPreview(null);
    } catch (error) {
      setPreview(null);
    }
  };

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center relative group cursor-pointer`}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Spinner size="md" />
        ) : preview || currentUrl ? (
          <img src={preview || currentUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <Camera className="size-8 text-indigo-400" />
        )}

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Upload className="size-6 text-white" />
        </div>
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