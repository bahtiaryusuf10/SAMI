'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Download, FileSpreadsheet, Settings2 } from 'lucide-react';
import { ChartSpecificSettings } from '@/stores/dashboardSettings';
import { SelectControl } from './SelectControl';
import { SwitchControl } from './SwtichControl';
import { useUser } from '@/contexts/UserContext';
import { useDashboardContext } from '@/contexts/DashboardContext';

interface BarChartSettingsProps {
  chartInstanceId: string;
  settings: ChartSpecificSettings;
  setChartSetting: (
    chartInstanceId: string,
    newSettings: Partial<ChartSpecificSettings>
  ) => void;
  dataKeysCount: number;
  onExportPng: () => void;
  onExportXls: () => void;
}

const layoutOptions = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
];

const modeOptions = [
  { value: 'grouped', label: 'Grouped' },
  { value: 'stacked', label: 'Stacked' },
];

export function BarChartSettings({
  chartInstanceId,
  settings,
  setChartSetting,
  dataKeysCount,
  onExportPng,
  onExportXls,
}: BarChartSettingsProps) {
  const layout = settings.layout || 'vertical';
  const mode = settings.groupMode || 'grouped';
  const sortByValue = settings.sortByValue || false;
  const isPublicView = useDashboardContext();

  // Permission
  const { can } = useUser();

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
            <SelectControl
              label="Layout"
              value={layout}
              onValueChange={(newLayout) =>
                setChartSetting(chartInstanceId, {
                  layout: newLayout as 'vertical' | 'horizontal',
                })
              }
              options={layoutOptions}
            />
          </div>
          {dataKeysCount > 1 && (
            <div>
              <SelectControl
                label="Mode"
                value={mode}
                onValueChange={(newMode) =>
                  setChartSetting(chartInstanceId, {
                    groupMode: newMode as 'grouped' | 'stacked',
                  })
                }
                options={modeOptions}
              />
            </div>
          )}
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
