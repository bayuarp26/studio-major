'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
}

export function FileUpload({ value, onChange, disabled }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled,
  });

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-background p-4 text-center transition-colors hover:border-primary/50',
        isDragActive && 'border-primary',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-primary" />
            <p className="mt-2 text-sm font-semibold text-foreground">CV telah diunggah.</p>
            <p className="mt-1 text-xs text-muted-foreground">Klik "Save All Changes" untuk menerapkan.</p>
            <Button
                type="button"
                variant="link"
                size="sm"
                className="mt-2 text-destructive hover:text-destructive/80"
                onClick={handleRemoveFile}
                disabled={disabled}
            >
                <X className="mr-1 h-4 w-4" /> Hapus File
            </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
          <UploadCloud className="h-12 w-12" />
          <p className="font-semibold">Seret & lepas CV Anda di sini</p>
          <p className="text-sm">atau klik untuk memilih file</p>
          <p className="text-xs">(PDF, DOC, DOCX)</p>
        </div>
      )}
    </div>
  );
}
