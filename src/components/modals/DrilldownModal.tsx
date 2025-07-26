'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { MyDataTableMaster } from '../tables/MyDataTableMaster';

interface DrilldownModalProps<TData> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  columns: ColumnDef<TData>[];
  data: TData[] | null;
  isLoading: boolean;
  searchPlaceholder?: string;
  initialPageSize?: number;
  onExport?: () => void;
}

export function DrilldownModal<TData>({
  isOpen,
  onClose,
  title,
  description,
  columns,
  data,
  isLoading,
  searchPlaceholder,
  initialPageSize = 10,
  onExport,
}: DrilldownModalProps<TData>) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-4xl bg-white border-gray-700 gap-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-5 sm:gap-4 md:gap-6 lg:gap-8">
            <div className="flex flex-col gap-2 min-w-0">
              <DialogTitle className="text-black text-left">
                {title}
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-left md:w-[620px]">
                {description}
              </DialogDescription>
            </div>
            {onExport && (
              <Button
                variant="ghost"
                className="justify-between font-normal bg-gray-100 text-gray-400 hover:text-blue-400 rounded-full"
                onClick={onExport}
              >
                Export to XLSX
                <FileSpreadsheet className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="pb-4 overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-24 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="text-black">Memuat data...</span>
            </div>
          ) : (
            <MyDataTableMaster
              columns={columns}
              data={data || []}
              searchPlaceholder={searchPlaceholder}
              isLoading={isLoading}
              initialPageSize={initialPageSize}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
