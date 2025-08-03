import { Button } from '@/components/ui/button';
import { ChevronDown, Lightbulb, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ExecutiveSummary({
  pageKey,
  dataForSummary,
  activeReportingYear,
}: {
  pageKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataForSummary: Record<string, any>;
  activeReportingYear: number | null;
}) {
  const aiSummaries = useDashboardSettingsStore((state) => state.aiSummaries);
  const setAiSummary = useDashboardSettingsStore((state) => state.setAiSummary);

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const summaryKey = `${pageKey}_${activeReportingYear || 'all'}`;
  const summary = aiSummaries[summaryKey];

  const handleGenerateSummary = async () => {
    if (summary) {
      setIsOpen(!isOpen);
      //   console.log(summary);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageKey: pageKey, data: dataForSummary }),
      });

      if (!response.ok) {
        throw new Error('Gagal mendapatkan respons dari server.');
      }

      const result = await response.json();
      setAiSummary(pageKey, activeReportingYear, result.summary);
    } catch (error) {
      console.error(error);
      toast.error('Gagal membuat ringkasan.');
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-end">
        <CollapsibleTrigger asChild>
          <Button
            onClick={handleGenerateSummary}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            {summary
              ? isOpen
                ? 'Tutup Analisis'
                : 'Lihat Analisis'
              : 'Buat Analisis'}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="mt-4 p-6 bg-white rounded-xl shadow-lg prose max-w-none">
          {isLoading && (
            <p className="text-sm">
              Model sedang menganalisis data, mohon tunggu...
            </p>
          )}
          {summary && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h1: ({ node, ...props }) => (
                  <h1 className="text-xl font-bold mb-2" {...props} />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h2: ({ node, ...props }) => (
                  <h2 className="text-lg font-semibold mt-3 mb-2" {...props} />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h3: ({ node, ...props }) => (
                  <h3 className="text-md font-medium mt-2 mb-1" {...props} />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                p: ({ node, ...props }) => (
                  <p className="text-sm mb-2" {...props} />
                ),
              }}
            >
              {summary}
            </ReactMarkdown>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
