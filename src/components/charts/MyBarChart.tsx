'use client';

import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { ResponsiveBar } from '@nivo/bar';
import { ColorSchemeId } from '@nivo/colors';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMemo, useRef, useState } from 'react';
import { BarChartSettings } from '../settings/BarChartSettings';
import { exportAsPng, exportAsXlsx } from '@/lib/utils/handleExportFile';
import { BarCustomLegend } from './BarCustomLegend';
import { normalizeTitleCase } from '@/lib/utils';
import { ChartBreadcrumb } from './ChartBreadcrumb';
import Draggable from 'react-draggable';
import { useUser } from '@/contexts/UserContext';

interface MyBarChartProps {
  pageKey: string;
  chartId: string;
  colorScheme: ColorSchemeId;
  enableLabel: boolean;
  drillDown?: boolean;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  dataKeys: string[];
  indexBy: string;
  axisBottomLegend: string;
  axisLeftLegend: string;
  title: string;
  type?: 'small' | 'medium' | 'large';
  layout?: 'vertical' | 'horizontal';
  grouped?: 'grouped' | 'stacked';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (data: any) => void;
  breadcrumbs?: { label: string; level: number }[];
  onBreadcrumbClick?: (level: number) => void;
}

export const MyBarChart = ({
  pageKey,
  chartId,
  colorScheme,
  enableLabel,
  drillDown,
  description,
  data,
  isLoading,
  error,
  dataKeys,
  indexBy,
  axisBottomLegend,
  axisLeftLegend,
  title,
  layout: layoutFromProps,
  grouped: groupedFromProps,
  onClick,
  breadcrumbs,
  onBreadcrumbClick,
}: MyBarChartProps) => {
  // Permission
  const { can } = useUser();

  const [hiddenKeys, setHiddenKeys] = useState<Record<string, boolean>>({});

  const handleLegendClick = (key: string) => {
    setHiddenKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const visibleKeys = dataKeys.filter((key) => !hiddenKeys[key]);

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

  // Preference Settings
  const chartInstanceId = `${pageKey}_${chartId}`;
  const chartSettings =
    useDashboardSettingsStore(
      (state) => state.chartSettings[chartInstanceId]
    ) || {};
  const setChartSetting = useDashboardSettingsStore(
    (state) => state.setChartSetting
  );

  const {
    layout = layoutFromProps || 'vertical',
    groupMode = groupedFromProps || 'grouped',
    sortByValue = false,
  } = chartSettings || {};

  const getColors = useMemo(() => ({ scheme: colorScheme }), [colorScheme]);

  // Get Sorted Data
  const sortedData = useMemo(() => {
    if (!sortByValue || !data || data.length === 0) {
      return data;
    }

    const sortKey = dataKeys[0];

    return [...data].sort((a, b) => (a[sortKey] || 0) - (b[sortKey] || 0));
  }, [data, sortByValue, dataKeys]);

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
            {drillDown && can('interact:charts') && (
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-5 h-5 text-blue-300" />
                </TooltipTrigger>
                <TooltipContent side="right" align="center" sideOffset={-2}>
                  <p>Drill down data</p>
                </TooltipContent>
              </Tooltip>
            )}
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
          <BarChartSettings
            chartInstanceId={chartInstanceId}
            settings={chartSettings}
            setChartSetting={setChartSetting}
            dataKeysCount={dataKeys.length}
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
        <div className="absolute -top-2 right-1 z-10">
          {breadcrumbs && breadcrumbs.length > 1 && onBreadcrumbClick && (
            <ChartBreadcrumb
              crumbs={breadcrumbs}
              onCrumbClick={onBreadcrumbClick}
            />
          )}
        </div>
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
            <ResponsiveBar
              data={sortedData}
              keys={visibleKeys}
              indexBy={indexBy}
              margin={{
                top: 20,
                right: layout === 'vertical' ? 20 : 30,
                bottom: 50,
                left: layout === 'vertical' ? 60 : 115,
              }}
              padding={0.3}
              groupMode={groupMode}
              layout={layout}
              enableLabel={enableLabel}
              valueScale={{ type: 'linear', nice: true }}
              indexScale={{ type: 'band', round: true }}
              colorBy={dataKeys.length > 1 ? 'id' : 'indexValue'}
              colors={getColors}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]],
              }}
              tooltip={({ id, value, indexValue }) => (
                <div
                  style={{
                    padding: '7px 12px',
                    background: 'white',
                    color: 'black',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    borderRadius: '3px',
                  }}
                >
                  {dataKeys.length > 1 ? (
                    <>
                      <strong>{id}</strong>, {indexValue}:{' '}
                      <strong>{value}</strong>
                    </>
                  ) : (
                    <>
                      {normalizeTitleCase(indexValue)}: <strong>{value}</strong>
                    </>
                  )}
                </div>
              )}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                truncateTickAt: sortedData.length > 4 ? 17 : 21,
                legend:
                  layout === 'vertical' ? axisBottomLegend : axisLeftLegend,
                legendPosition: 'middle',
                legendOffset: 40,
                format: (value) => normalizeTitleCase(value),
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                truncateTickAt: layout === 'vertical' ? 0 : 14,
                tickRotation: layout === 'vertical' ? 0 : -30,
                legend:
                  layout === 'vertical' ? axisLeftLegend : axisBottomLegend,
                legendPosition: 'middle',
                legendOffset: layout === 'vertical' ? -50 : -100,
                format: (value) => normalizeTitleCase(value),
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1.6]],
              }}
              legends={[]}
              onClick={onClick}
            />
            {dataKeys.length > 1 && (
              <Draggable
                nodeRef={legendRef}
                handle=".drag-handle"
                bounds="parent"
              >
                <div ref={legendRef} className="absolute top-8 right-13 z-10">
                  <BarCustomLegend
                    keys={dataKeys}
                    colorScheme={colorScheme}
                    hiddenKeys={hiddenKeys}
                    onToggle={handleLegendClick}
                  />
                </div>
              </Draggable>
            )}
          </>
        )}
      </div>
    </div>
  );
};
