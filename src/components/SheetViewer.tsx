import { ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface SheetViewerProps {
  url: string | null | undefined;
  title?: string;
}

export function SheetViewer({ url, title }: SheetViewerProps) {
  if (!url) {
    return (
      <div className="w-full h-full border rounded-lg flex items-center justify-center bg-gray-50 text-gray-500">
        <p>Dokumen tidak tersedia.</p>
      </div>
    );
  }

  // URLs copied from Google's embed-code snippet come with HTML-escaped
  // ampersands (&amp;), which break query params like widget=true when set
  // as a JSX attribute (no HTML-entity decoding happens there).
  const normalizedUrl = url.replace(/&amp;/g, '&');

  return (
    <div className="w-full h-full bg-white rounded-2xl py-3 px-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-blue-400">{title}</h2>
        <a
          href={normalizedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 text-sm text-blue-400 hover:underline"
        >
          Buka di tab baru
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <a href={normalizedUrl} target="_blank" rel="noopener noreferrer">
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
        src={normalizedUrl}
        className="w-full h-[500px] sm:h-[800px] border rounded-lg mb-5"
        title={title}
      />
    </div>
  );
}
