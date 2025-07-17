'use client';

import { normalizeTitleCase } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface LineCustomLegendProps {
  series: { id: string; label: string; color: string }[];
  hiddenKeys: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export const LineCustomLegend = ({
  series,
  hiddenKeys,
  onToggle,
}: LineCustomLegendProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-md p-3 rounded-lg shadow-md border border-gray-200">
      <div className="drag-handle cursor-move text-center text-gray-400 mb-1">
        <GripVertical size={20} className="inline-block rotate-90" />
      </div>
      <div className="flex flex-col gap-1">
        {series.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`group flex items-center p-1 cursor-pointer transition-colors hover:bg-gray-100 ${
              hiddenKeys[item.id] ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <div
              className="w-4 h-4 mr-2 transition-transform duration-200 ease-in-out group-hover:scale-115 group-hover:shadow-sm rounded-2xl"
              style={{
                backgroundColor: 'bg-white',
                boxShadow: `inset 0 0 0 4px ${item.color}`,
              }}
            />
            <span
              className={`text-xs transition-colors group-hover:font-medium ${
                hiddenKeys[item.id]
                  ? 'line-through text-gray-600'
                  : 'text-black'
              }`}
            >
              {normalizeTitleCase(item.label)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
