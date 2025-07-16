'use client';

import { ColorSchemeId, useOrdinalColorScale } from '@nivo/colors';

interface BarCustomLegendProps {
  keys: string[];
  colorScheme: ColorSchemeId;
  hiddenKeys: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export const BarCustomLegend = ({
  keys,
  colorScheme,
  hiddenKeys,
  onToggle,
}: BarCustomLegendProps) => {
  const getColor = useOrdinalColorScale({ scheme: colorScheme }, 'id');

  return (
    <div className="bg-white/80 backdrop-blur-md p-3 rounded-lg shadow-md border border-gray-200">
      <div className="flex flex-col gap-1">
        {keys.map((key) => (
          <div
            key={key}
            onClick={() => onToggle(key)}
            className={`group flex items-center p-1 cursor-pointer transition-colors hover:bg-gray-100 ${
              hiddenKeys[key] ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <div
              className="w-4 h-4 mr-2 transition-transform duration-200 ease-in-out group-hover:scale-115 group-hover:shadow-sm"
              style={{ backgroundColor: getColor({ id: key }) }}
            />
            <span
              className={`text-xs transition-colors group-hover:font-medium ${
                hiddenKeys[key] ? 'line-through text-gray-600' : 'text-black'
              }`}
            >
              {key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
