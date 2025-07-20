'use client';

import { ColorSchemeId, colorSchemes } from '@nivo/colors';
import { ResponsivePie } from '@nivo/pie';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCallback, useMemo, useRef, useState } from 'react';
import { PieChartSettings } from '../settings/PieChartSettings';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { exportAsPng, exportAsXlsx } from '@/lib/utils/handleExportFile';
import { PieCustomLegend } from './PieCustomLegend';
import { scaleOrdinal } from 'd3-scale';
import { schemeAccent, schemePaired, schemePastel1 } from 'd3-scale-chromatic';
import { ChartBreadcrumb } from './ChartBreadcrumb';

const schemeNivo = colorSchemes.nivo;

const getD3Scheme = (schemeName: ColorSchemeId) => {
  switch (schemeName) {
    case 'nivo':
      return schemeNivo;
    case 'accent':
      return schemeAccent;
    case 'paired':
      return schemePaired;
    case 'pastel1':
      return schemePastel1;
    default:
      return schemePastel1;
  }
};

interface MyPieChartProps {
  pageKey: string;
  chartId: string;
  colorScheme: ColorSchemeId;
  enableArcLabels: boolean;
  drillDown?: boolean;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  title: string;
  type?: 'small' | 'medium' | 'large';
  isPercentage?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (data: any) => void;
  breadcrumbs?: { label: string; level: number }[];
  onBreadcrumbClick?: (level: number) => void;
}

export const MyPieChart = ({
  pageKey,
  chartId,
  colorScheme,
  enableArcLabels,
  drillDown,
  description,
  data,
  isLoading,
  error,
  title,
  isPercentage = false,
  onClick,
  breadcrumbs,
  onBreadcrumbClick,
}: MyPieChartProps) => {
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

  const colorScale = useMemo(() => {
    const ids = data.map((item) => item.id);
    const dynamicScheme = getD3Scheme(colorScheme);

    return scaleOrdinal<string | number, string>()
      .domain(ids)
      .range(dynamicScheme);
  }, [data, colorScheme]);

  const { innerRadius = 0, sortByValue = false } = chartSettings || {};
  const arcLink = chartSettings?.arcLink ?? 10;

  // Filter data (show/hide)
  const [hiddenIds, setHiddenIds] = useState(new Set<string | number>());

  const filteredData = useMemo(
    () => data.filter((item) => !hiddenIds.has(item.id)),
    [data, hiddenIds]
  );

  const toggleIdVisibility = useCallback((id: string | number) => {
    setHiddenIds((prevHiddenIds) => {
      const newHiddenIds = new Set(prevHiddenIds);
      if (newHiddenIds.has(id)) {
        newHiddenIds.delete(id);
      } else {
        newHiddenIds.add(id);
      }
      return newHiddenIds;
    });
  }, []);

  return (
    <div
      ref={chartRef}
      className="bg-white rounded-xl shadow p-5 w-full h-full max-w-full transition-shadow hover:shadow-lg hover:scale-[1.01] duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between mb-3 relative">
        <div className="flex flex-col items-start">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-lg font-semibold text-blue-400" data-no-drag>
              {title}
            </h2>
            {drillDown && (
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
          <PieChartSettings
            chartInstanceId={chartInstanceId}
            settings={chartSettings}
            setChartSetting={setChartSetting}
            onExportPng={handleExportPng}
            onExportXls={handleExportXls}
            data-no-drag
          />
        </div>
      </div>
      <div className="relative w-full h-full pb-10 pt-2 px-5" data-no-drag>
        <div className="absolute -top-3 right-1 z-10">
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
            <ResponsivePie
              data={filteredData}
              valueFormat={
                isPercentage
                  ? (value) => `${value.toFixed(1)}%`
                  : (value) => value.toLocaleString('id-ID')
              }
              margin={{ top: 30, right: 90, bottom: 110, left: 90 }}
              colors={(datum) => colorScale(datum.id)}
              enableArcLabels={enableArcLabels}
              innerRadius={innerRadius}
              sortByValue={sortByValue}
              arcLinkLabelsDiagonalLength={10}
              arcLinkLabelsStraightLength={arcLink}
              padAngle={0.6}
              cornerRadius={2}
              activeOuterRadiusOffset={8}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={13}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              legends={[]}
              onClick={onClick}
            />
            <PieCustomLegend
              data={data}
              colors={colorScale}
              hiddenIds={hiddenIds}
              onToggle={toggleIdVisibility}
            />
          </>
        )}
      </div>
    </div>
  );
};
