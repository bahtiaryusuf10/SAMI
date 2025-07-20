import { useEffect, useState } from 'react';

interface PdfViewerProps {
  url: string | null | undefined;
  title: string;
}

export function PdfViewer({ url, title }: PdfViewerProps) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (navigator.pdfViewerEnabled === false) {
      setShowFallback(true);
    }
  }, []);

  if (!url) {
    return (
      <div className="w-full h-full border rounded-lg flex items-center justify-center bg-gray-50 text-gray-500">
        <p>Dokumen tidak tersedia.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-2xl py-6 px-8">
      <h2 className="text-lg font-semibold text-blue-400 mb-2 ">{title}</h2>
      <iframe
        src={url}
        className="w-full h-[500px] border rounded-lg mb-5"
        title={title}
      >
        {showFallback && (
          <p className="p-4 text-center text-black">
            Browser Anda tidak mendukung untuk menampilkan dokumen akreditasi,
            silakan unduh dokumen{' '}
            <a
              href={url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              di sini
            </a>
            .
          </p>
        )}
      </iframe>
    </div>
  );
}
