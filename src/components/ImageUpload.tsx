import React, { useCallback, useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // adjusted import path to '@/lib/utils'

interface ImageUploadProps {
  label: string;
  image: string | null;
  onUpload: (file: File) => void;
  onClear: () => void;
  className?: string;
}

export function ImageUpload({ label, image, onUpload, onClear, className }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const validateAndUpload = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/heic', 'image/heif'];
    const isImage = file.type.startsWith('image/') || validTypes.includes(file.type);
    if (!isImage) {
      setError('Subí una imagen (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen debe pesar menos de 10MB.');
      return;
    }
    onUpload(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        validateAndUpload(e.dataTransfer.files[0]);
      }
    },
    [onUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        validateAndUpload(e.target.files[0]);
      }
    },
    [onUpload]
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <span className="text-xs font-medium text-white/70 uppercase tracking-[0.2em]">{label}</span>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "relative flex flex-col items-center justify-center w-full aspect-[3/4] rounded-3xl overflow-hidden transition-all duration-500 border border-white/10",
          !image && "cursor-pointer border-dashed hover:border-white/30",
          error && "border-red-500/50 bg-red-500/5"
        )}
      >
        {image ? (
          <>
            <img src={image} alt={label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
                setError(null);
              }}
              className="absolute top-4 right-4 p-3 bg-black/40 hover:bg-black/70 rounded-full backdrop-blur-md transition-all border border-white/10 hover:scale-110"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center gap-4 text-white/50 p-6 text-center">
              <Upload className="w-10 h-10 mb-2 opacity-50" />
              <span className="text-sm uppercase tracking-[0.2em] font-light">Drop or Click to Upload</span>
              <span className="text-[10px] uppercase tracking-widest opacity-50">Max 5MB • High-Res Preferred</span>
            </div>
          </>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs mt-2 justify-center">
          <AlertCircle className="w-4 h-4" />
          <span className="tracking-wide">{error}</span>
        </div>
      )}
    </div>
  );
}
