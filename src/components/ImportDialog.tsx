'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { handleImportFile } from '@/lib/utils/handleImportFile';
import { toast } from 'sonner';
import { FileIcon, Loader2, X } from 'lucide-react';
import { importConfigurations } from '@/lib/utils/importConfig';
import { Input } from './ui/input';

export default function ImportDialog({ type }: { type: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [year, setYear] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isLoading,
    maxFiles: 1,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
  });

  const config = importConfigurations[type];

  if (!config) {
    console.error(`Konfigurasi untuk tipe impor "${type}" tidak ditemukan.`);
    return null;
  }

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) {
      toast.error('Tidak ada file yang dipilih.');
      return;
    }

    // if ((type === 'students' || type === 'lecturers') && !year.trim()) {
    if (!year.trim() || !sourceUrl.trim()) {
      toast.error('Mohon isi tahun data terlebih dahulu.');
      return;
    }

    setIsLoading(true);

    try {
      const url = config.url;
      const result = await handleImportFile(
        selectedFile,
        type,
        url,
        year,
        sourceUrl
      );

      if (result && result.message) {
        toast.success(result.message);

        setSelectedFile(null);
        setYear('');
        setSourceUrl('');
        setOpen(false);
      } else {
        throw new Error(result.error || 'Respons dari server tidak valid.');
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(`Gagal: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedFile(null);
          setYear('');
          setSourceUrl('');
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-blue-300 hover:bg-blue-200">
          Import {config.buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogTitle>{config.title}</DialogTitle>
        <DialogDescription>{config.description}</DialogDescription>
        {/* {(type === 'students' || type === 'lecturers') && ( */}
        <Input
          type="number"
          placeholder="Masukkan tahun laporan (contoh: 2025)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          disabled={isLoading}
        />
        <Input
          type="url"
          placeholder="Masukkan URL sumber data"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          disabled={isLoading}
        />

        {/* )} */}

        <div
          {...getRootProps()}
          className={cn(
            'mt-2 border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-200',
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
            isLoading
              ? 'cursor-not-allowed bg-gray-100'
              : 'cursor-pointer hover:bg-muted'
          )}
        >
          <input {...getInputProps()} />

          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p>Memproses file...</p>
            </div>
          ) : selectedFile ? (
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <FileIcon className="h-6 w-6" />
              <span className="font-medium">{selectedFile.name}</span>
              <Button
                variant="destructive"
                size="icon"
                className="ml-2 h-6 w-6 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p>Drop atau klik untuk memilih file</p>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleConfirmImport}
            disabled={!selectedFile || isLoading}
            className="bg-blue-400 hover:bg-blue-300"
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
