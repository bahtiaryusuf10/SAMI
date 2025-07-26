'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { useUser } from '@/contexts/UserContext';
import { Download, FileSpreadsheet, Settings2 } from 'lucide-react';

interface BulletChartSettingsProps {
  onExportPng: () => void;
  onExportXls: () => void;
}

export function BulletChartSettings({
  onExportPng,
  onExportXls,
}: BulletChartSettingsProps) {
  // Permission
  const { can } = useUser();
  const isPublicView = useDashboardContext();

  if (isPublicView.isPublicView || !can('export:data')) return null;

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
      </PopoverContent>
    </Popover>
  );
}
