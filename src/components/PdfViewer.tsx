interface PdfViewerProps {
  url: string | null | undefined;
  title: string;
}

export function PdfViewer({ url, title }: PdfViewerProps) {
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
        Browser Anda tidak mendukung iframe, silakan unduh dokumen{' '}
        <a href={url}>di sini</a>.
      </iframe>
    </div>
  );
}
