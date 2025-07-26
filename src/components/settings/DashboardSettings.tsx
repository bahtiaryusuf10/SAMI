'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Paintbrush } from 'lucide-react';
import { type ColorSchemeId } from '@nivo/colors';
import { useUser } from '@/contexts/UserContext';

interface DashboardSettingsProps {
  pageKey: string;
  theme: ColorSchemeId;
  showLabels: boolean;
  setPageTheme: (pageKey: string, theme: ColorSchemeId) => void;
  setPageShowLabels: (pageKey: string, show: boolean) => void;
}

const themeOptions = [
  { value: 'nivo', label: 'Nivo' },
  { value: 'accent', label: 'Accent' },
  { value: 'paired', label: 'Paired' },
  { value: 'pastel1', label: 'Pastel' },
];

export function DashboardSettings({
  pageKey,
  theme,
  showLabels,
  setPageTheme,
  setPageShowLabels,
}: DashboardSettingsProps) {
  // Permission
  const { can } = useUser();

  if (!can('interact:charts')) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white hover:bg-gray-200 h-10 w-10"
        >
          <Paintbrush
            className="text-blue-400"
            style={{ height: '21px', width: '21px' }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 bg-white" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-black">
              Pengaturan Halaman
            </h4>
            <p className="text-sm text-gray-500">
              Pengaturan ini diterapkan untuk halaman ini saja.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="grid grid-cols-3 items-center">
              <label className="text-sm font-medium col-span-1">Tema</label>
              <Select
                value={theme}
                onValueChange={(newTheme: ColorSchemeId) =>
                  setPageTheme(pageKey, newTheme)
                }
              >
                <SelectTrigger className="w-full col-span-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-sm font-medium">Label</label>
              <div className="col-span-2 flex justify-end">
                <Switch
                  checked={showLabels}
                  onCheckedChange={(newCheckedValue) => {
                    setPageShowLabels(pageKey, newCheckedValue);
                  }}
                  style={{
                    backgroundColor: showLabels ? '#60A5FA' : '#D1D5DB',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
