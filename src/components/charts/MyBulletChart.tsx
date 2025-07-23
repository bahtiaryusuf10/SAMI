'use client';

import { ResponsiveBullet } from '@nivo/bullet';
import { ColorSchemeId } from '@nivo/colors';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { exportAsPng, exportAsXlsx } from '@/lib/utils/handleExportFile';
import { BulletChartSettings } from '../settings/BulletChartSettings';

interface MyBulletChartProps {
  pageKey: string;
  chartId: string;
  colorScheme: ColorSchemeId;
  enableLabel: boolean;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  title: string;
  type?: 'small' | 'medium' | 'large';
  layout?: 'vertical' | 'horizontal';
}

export const MyBulletChart = ({
  colorScheme,
  description,
  data,
  isLoading,
  error,
  title,
}: MyBulletChartProps) => {
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

  // const getColor = useOrdinalColorScale({ scheme: colorScheme }, 'id');

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
          <BulletChartSettings
            onExportPng={handleExportPng}
            onExportXls={handleExportXls}
            data-no-drag
          />
        </div>
      </div>
      <div
        className="relative w-full flex-1 mb-3 px-5 overflow-hidden"
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
            <ResponsiveBullet
              data={data}
              margin={{ top: 50, right: 90, bottom: 50, left: 90 }}
              layout="vertical"
              spacing={79}
              titleAlign="start"
              titleOffsetX={-70}
              measureBorderColor={{ theme: 'background' }}
              measureSize={0.2}
              rangeColors={colorScheme}
            />
          </>
        )}
      </div>
    </div>
  );
};
