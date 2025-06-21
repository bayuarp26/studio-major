'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
        'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-background p-4 text-center transition-colors hover:border-primary/50',
        (isDragActive || isDragging) && 'border-primary',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="relative h-40 w-full">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            style={{ objectFit: 'contain' }}
            className="rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 z-10 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
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
