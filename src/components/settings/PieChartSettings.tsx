'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Download, FileSpreadsheet, Settings2 } from 'lucide-react';
import { ChartSpecificSettings } from '@/stores/dashboardSettings';
import { SwitchControl } from './SwtichControl';
import { SliderControl } from './SliderControl';
import { useUser } from '@/contexts/UserContext';
import { useDashboardContext } from '@/contexts/DashboardContext';

interface PieChartSettingsProps {
  chartInstanceId: string;
  settings: ChartSpecificSettings;
  setChartSetting: (
    chartInstanceId: string,
    newSettings: Partial<ChartSpecificSettings>
  ) => void;
  onExportPng: () => void;
  onExportXls: () => void;
}

export function PieChartSettings({
  chartInstanceId,
  settings,
  setChartSetting,
  onExportPng,
  onExportXls,
}: PieChartSettingsProps) {
  // Permission
  const { can } = useUser();

  const innerRadius = settings.innerRadius || 0;
  const arcLink = settings.arcLink ?? 10;
  const sortByValue = settings.sortByValue || false;
  const isPublicView = useDashboardContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white hover:bg-gray-200"
        >
          <Settings2 className="h-5 w-5 text-blue-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-white" align="end" data-no-drag>
        <div className="space-y-3">
          {/* {can('interact:charts') && (
            <> */}
          <div>
            <SliderControl
              label="Inner Radius"
              value={innerRadius}
              onValueChange={(newValue) => {
                setChartSetting(chartInstanceId, {
                  innerRadius: newValue[0],
                });
              }}
              max={0.95}
              step={0.05}
            />
          </div>
          <div>
            <SliderControl
              label="Arc Link"
              value={arcLink}
              onValueChange={(newValue) => {
                setChartSetting(chartInstanceId, { arcLink: newValue[0] });
              }}
              max={20}
              step={2}
            />
          </div>
          <div className="flex justify-between items-center">
            <SwitchControl
              label="Sort by Value"
              checked={sortByValue}
              onCheckedChange={(newSortValue) =>
                setChartSetting(chartInstanceId, {
                  sortByValue: newSortValue,
                })
              }
            />
          </div>
          {/* </>
          )} */}
          {!isPublicView.isPublicView && can('export:data') && (
            <div className="pt-2 border-t border-gray-200">
              <h4 className="text-sm font-medium">Export</h4>
              <div className="grid gap-1 mt-1">
                <Button
                  variant="ghost"
                  className="w-full justify-between font-normal hover:text-blue-400 hover:font-medium"
                  onClick={onExportPng}
                >
                  PNG
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-between font-normal hover:text-blue-400 hover:font-medium"
                  onClick={onExportXls}
                >
                  XLSX
                  <FileSpreadsheet className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
