'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChartSpecificSettings } from '@/stores/dashboardSettings';
import { Download, FileSpreadsheet, Settings2 } from 'lucide-react';
import { SwitchControl } from './SwtichControl';
import { useUser } from '@/contexts/UserContext';
import { useDashboardContext } from '@/contexts/DashboardContext';
// import { SelectControl } from './SelectControl';

interface LineChartSettingsProps {
  chartInstanceId: string;
  settings: ChartSpecificSettings;
  setChartSetting: (
    chartInstanceId: string,
    newSettings: Partial<ChartSpecificSettings>
  ) => void;
  onExportPng: () => void;
  onExportXls: () => void;
}

export function LineChartSettings({
  chartInstanceId,
  settings,
  setChartSetting,
  onExportPng,
  onExportXls,
}: LineChartSettingsProps) {
  // Permission
  const { can } = useUser();
  const isPublicView = useDashboardContext();

  const enableArea = settings.enableArea || false;

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
          {/* {can('interact:charts') && ( */}
          <div className="flex justify-between items-center">
            <SwitchControl
              label="Show Area"
              checked={enableArea}
              onCheckedChange={(newEnableArea) =>
                setChartSetting(chartInstanceId, {
                  enableArea: newEnableArea,
                })
              }
            />
          </div>
          {/* )} */}
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
