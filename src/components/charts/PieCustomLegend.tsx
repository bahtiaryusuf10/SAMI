'use client';

interface LegendItem {
  id: string | number;
  label: string | number;
}

interface PieCustomLegendProps {
  data: LegendItem[];
  colors: (id: string | number) => string;
  hiddenIds: Set<string | number>;
  onToggle: (id: string | number) => void;
}

export function PieCustomLegend({
  data,
  colors,
  hiddenIds,
  onToggle,
}: PieCustomLegendProps) {
  return (
    <div
      className="absolute bottom-18 left-1/2 flex -translate-x-1/2 w-[90%] flex-row flex-wrap justify-center gap-x-4 gap-y-2"
      data-no-drag
    >
      {data.map((item) => {
        const isHidden = hiddenIds.has(item.id);

        return (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            className="group flex items-center text-sm cursor-pointer hover:bg-gray-100 p-1"
          >
            <span
              className="w-4 h-4 rounded-full mr-2 transition-opacity group-hover:scale-115 group-hover:shadow-sm ease-in-out duration-200"
              style={{
                backgroundColor: colors(item.id),
                opacity: isHidden ? 0.3 : 1,
              }}
            />
            <span
              className={`text-[11px] transition-colors group-hover:font-medium ${
                isHidden ? 'line-through text-gray-400' : 'text-black'
              }`}
              // style={{ fontFamily: 'sans-serif' }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
