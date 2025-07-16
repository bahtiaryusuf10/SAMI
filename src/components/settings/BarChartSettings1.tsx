'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings2 } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type BarChartSettingsProps = {
  layout: 'horizontal' | 'vertical';
  setLayout: Dispatch<SetStateAction<'horizontal' | 'vertical'>>;
  groupMode: 'stacked' | 'grouped';
  setGroupMode: Dispatch<SetStateAction<'stacked' | 'grouped'>>;
  colorPalette: 'nivo' | 'accent' | 'paired' | 'spectral';
  setColorPalette: Dispatch<
    SetStateAction<'nivo' | 'accent' | 'paired' | 'spectral'>
  >;
  showLabels: true | false;
  setShowLabels: Dispatch<SetStateAction<true | false>>;
};

export default function BarChartSettings({
  layout,
  setLayout,
  groupMode,
  setGroupMode,
  colorPalette,
  setColorPalette,
  showLabels,
  setShowLabels,
}: BarChartSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <Settings2 className="h-5 w-5 text-gray-600" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]" align="end" data-no-drag>
        <div className="space-y-3">
          {/* Layout */}
          <div>
            <label className="text-sm font-medium">Layout</label>
            {/* <Select value={layout} onValueChange={setLayout}> */}
            <Select
              value={layout}
              onValueChange={(value: string) =>
                setLayout(value as 'horizontal' | 'vertical')
              }
            >
              <SelectTrigger className="w-full" data-no-drag>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical" data-no-drag>
                  Vertical
                </SelectItem>
                <SelectItem value="horizontal" data-no-drag>
                  Horizontal
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Group Mode */}
          <div>
            <label className="text-sm font-medium">Group Mode</label>
            {/* <Select value={groupMode} onValueChange={setGroupMode}> */}
            <Select
              value={groupMode}
              onValueChange={(value: string) =>
                setGroupMode(value as 'stacked' | 'grouped')
              }
            >
              <SelectTrigger className="w-full" data-no-drag>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grouped" data-no-drag>
                  Grouped
                </SelectItem>
                <SelectItem value="stacked" data-no-drag>
                  Stacked
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Palette */}
          <div>
            <label className="text-sm font-medium">Color Palette</label>
            {/* <Select value={colorPalette} onValueChange={setColorPalette}> */}
            <Select
              value={colorPalette}
              onValueChange={(value: string) =>
                setColorPalette(
                  value as 'nivo' | 'accent' | 'paired' | 'spectral'
                )
              }
            >
              <SelectTrigger className="w-full" data-no-drag>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nivo" data-no-drag>
                  Nivo
                </SelectItem>
                <SelectItem value="accent" data-no-drag>
                  Accent
                </SelectItem>
                <SelectItem value="paired" data-no-drag>
                  Paired
                </SelectItem>
                <SelectItem value="spectral" data-no-drag>
                  Spectral
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show Labels */}
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Show Label</label>
            <Switch
              checked={showLabels}
              onCheckedChange={setShowLabels}
              style={{
                backgroundColor: showLabels ? '#60A5FA' : '#D1D5DB',
              }}
              data-no-drag
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
