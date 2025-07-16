'use client';

import { useState } from 'react';
import { getOrCreateShareLink } from '@/app/actions/sharingActions';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Share2, Copy, Check, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';

type ShareButtonProps = {
  dashboardId: string;
  activeFilterValue?: number | string | null;
  filterQueryParamName?: string;
};

export function ShareButton({
  dashboardId,
  activeFilterValue,
  filterQueryParamName = 'year',
}: ShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  const handleGetOrCreate = async () => {
    setIsLoading(true);
    setShareUrl('');
    const result = await getOrCreateShareLink(dashboardId, 1);
    setIsLoading(false);

    if (result.error) {
      toast.error('Failed to get the Link', { description: result.error });
    } else if (result.shareId) {
      const baseUrl = `${window.location.origin}/share/${result.shareId}`;
      const finalUrl = activeFilterValue
        ? `${baseUrl}?${filterQueryParamName}=${activeFilterValue}`
        : baseUrl;

      setShareUrl(finalUrl);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white hover:bg-gray-200 h-10 w-10"
        >
          <Share2
            className="text-blue-400"
            style={{ height: '21px', width: '21px' }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-white" align="end">
        <div className="space-y-2">
          <h4 className="font-semibold">Share Dashboard</h4>
          {shareUrl ? (
            <div className="flex items-center space-x-2">
              <Input value={shareUrl} readOnly />
              <Button
                size="icon"
                onClick={handleCopy}
                className="bg-blue-400 hover:bg-blue-300"
              >
                {hasCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleGetOrCreate}
              disabled={isLoading}
              className="bg-blue-400 hover:bg-blue-300"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLoading
                ? 'Creating...'
                : shareUrl
                ? 'Created link'
                : 'Make a new public link'}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
