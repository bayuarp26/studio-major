'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const convertFileToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragging(false);
    if (acceptedFiles.length > 0) {
      convertFileToBase64(acceptedFiles[0]);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'] },
    maxFiles: 1,
    disabled,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-background p-4 text-center transition-colors hover:border-primary/50 min-h-[160px]',
        (isDragActive || isDragging) && 'border-primary',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="flex flex-col items-center justify-center">
            <FileImage className="h-12 w-12 text-primary" />
            <p className="mt-2 text-sm font-semibold text-foreground">Foto profil telah diunggah.</p>
            <p className="mt-1 text-xs text-muted-foreground">Seret atau klik untuk mengganti.</p>
            <Button
                type="button"
                variant="link"
                size="sm"
                className="mt-2 text-destructive hover:text-destructive/80"
                onClick={handleRemoveImage}
                disabled={disabled}
            >
                <X className="mr-1 h-4 w-4" /> Hapus Foto
            </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
          <UploadCloud className="h-12 w-12" />
          <p className="font-semibold">Drag & drop an image here</p>
          <p className="text-sm">or click to select a file</p>
          <p className="text-xs">(JPG, PNG, GIF, WEBP)</p>
        </div>
      )}
    </div>
  );
}
