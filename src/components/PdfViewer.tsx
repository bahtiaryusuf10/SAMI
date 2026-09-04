import { ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface PdfViewerProps {
  url: string | null | undefined;
  title: string;
  className?: string;
}

export function PdfViewer({ url, title, className }: PdfViewerProps) {
  if (!url) {
    return (
      <div
        className={cn(
          'w-full h-full border rounded-lg flex items-center justify-center bg-gray-50 text-gray-500',
          className
        )}
      >
        <p>Dokumen tidak tersedia.</p>
      </div>
    );
  }

  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div className={cn('w-full h-full bg-white rounded-2xl py-6 px-8', className)}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-blue-400">{title}</h2>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 text-sm text-blue-400 hover:underline"
        >
          Buka di tab baru
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Button
          type="button"
          variant="outline"
          className="sm:hidden w-full mb-3 border-blue-200 text-blue-400"
        >
          Buka Dokumen di Tab Baru
          <ExternalLink className="h-4 w-4" />
        </Button>
      </a>
      <p className="sm:hidden text-xs text-gray-400 mb-2 -mt-1">
        Dokumen di bawah ini mungkin tidak bisa di-scroll di perangkat mobile
        &mdash; gunakan tombol di atas untuk membukanya penuh.
      </p>
      <iframe
        src={viewerUrl}
        className="w-full h-[400px] sm:h-[500px] border rounded-lg mb-5"
        title={title}
      />
    </div>
  );
}
