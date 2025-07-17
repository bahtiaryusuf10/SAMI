import { exportAsPng, exportAsXlsx } from '@/lib/utils/handleExportFile';
import { ColorSchemeId, useOrdinalColorScale } from '@nivo/colors';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { ScatterPlotSettings } from '../settings/ScatterPlotSettings';
import Draggable from 'react-draggable';
import { ScatterCustomLegend } from './ScatterCustomLegend';

interface MyScatterPlotProps {
  colorScheme: ColorSchemeId;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  title: string;
  type?: 'small' | 'medium' | 'large';
  axisBottomLegend: string;
  axisLeftLegend: string;
}

export const MyScatterPlot = ({
  colorScheme,
  description,
  data,
  isLoading,
  error,
  title,
  axisBottomLegend,
  axisLeftLegend,
}: MyScatterPlotProps) => {
  const [hiddenKeys, setHiddenKeys] = useState<Record<string, boolean>>({});

  const handleLegendClick = (id: string) => {
    setHiddenKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleData = useMemo(
    () => data.filter((series) => !hiddenKeys[series.id]),
    [data, hiddenKeys]
  );

  const getColor = useOrdinalColorScale({ scheme: colorScheme }, 'id');

  // Export
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExportPng = () => {
    if (chartRef.current) {
      exportAsPng(chartRef.current, title);
    }
  };

  const handleExportXls = () => {
    exportAsXlsx(data, title);
  };

  const getColors = useMemo(() => ({ scheme: colorScheme }), [colorScheme]);
  const legendRef = useRef(null);

  return (
    <div
      ref={chartRef}
      className="bg-white rounded-xl shadow p-5 w-full h-full max-w-full transition-shadow hover:shadow-lg hover:scale-[1.01] duration-200 flex flex-col"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between mb-3 relative">
        <div className="flex flex-col items-start">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-lg font-semibold text-blue-400" data-no-drag>
              {title}
            </h2>
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-1" data-no-drag>
              {description}
            </p>
          )}
        </div>
        <div
          className="absolute top-15 right-0 z-10 sm:static sm:top-0 sm:right-0 sm:z-0"
          data-no-drag
        >
          <ScatterPlotSettings
            onExportPng={handleExportPng}
            onExportXls={handleExportXls}
            data-no-drag
          />
        </div>
      </div>
      <div
        className="relative w-full flex-1 mb-4 px-5 overflow-hidden"
        data-no-drag
      >
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full -mt-8">
            <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            <span className="ml-2 text-black text-md">Memuat data...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center w-full h-full -mt-8">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="ml-2 text-red-400 text-md">Gagal memuat data.</p>
          </div>
        ) : (
          <>
            <ResponsiveScatterPlot
              data={visibleData}
              margin={{ top: 45, right: 30, bottom: 50, left: 75 }}
              xScale={{ type: 'linear', min: 0, max: 'auto' }}
              xFormat=">-.2f"
              yScale={{ type: 'linear', min: 0, max: 'auto' }}
              yFormat=">-.2f"
              blendMode="normal"
              colors={getColors}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: axisBottomLegend,
                legendPosition: 'middle',
                legendOffset: 46,
                truncateTickAt: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: axisLeftLegend,
                legendPosition: 'middle',
                legendOffset: -60,
                truncateTickAt: 0,
              }}
              legends={[]}
            />
            <Draggable
              nodeRef={legendRef}
              handle=".drag-handle"
              bounds="parent"
            >
              <div ref={legendRef} className="absolute top-15 left-30 z-10">
                <ScatterCustomLegend
                  series={data.map((d) => ({
                    id: d.id,
                    label: d.id,
                    color: getColor({ id: d.id }),
                  }))}
                  hiddenKeys={hiddenKeys}
                  onToggle={handleLegendClick}
                />
              </div>
            </Draggable>
          </>
        )}
      </div>
    </div>
  );
};
