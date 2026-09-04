'use client';

import type { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface InfoTooltipProps {
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  className?: string;
}

export function InfoTooltip({
  content,
  side = 'right',
  align = 'center',
  sideOffset = 8,
  className = 'w-5 h-5 text-blue-300',
}: InfoTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Info className={`${className} cursor-pointer`} data-no-drag />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto bg-white p-3 shadow-lg text-sm text-black"
        side={side}
        align={align}
        sideOffset={sideOffset}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
