'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Target } from 'lucide-react';

interface TargetInfoProps {
  targets: Record<string, number>;
}

export function TargetInfo({ targets }: TargetInfoProps) {
  const targetEntries = Object.entries(targets);

  if (targetEntries.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Target className="h-5 w-5 text-blue-300 cursor-pointer" data-no-drag />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto bg-white p-4 shadow-lg"
        side="right"
        align="start"
        alignOffset={-5}
        sideOffset={8}
      >
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-black">Target Capaian</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {targetEntries.map(([label, value]) => (
              <li key={label}>
                {label}: <span className="font-semibold">{value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
