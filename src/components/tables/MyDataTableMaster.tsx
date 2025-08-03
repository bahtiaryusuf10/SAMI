/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnSizingState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown, FileSpreadsheet, Info, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface MyDataTableMasterProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchPlaceholder?: string;
  isLoading: boolean;
  initialPageSize?: number;
  title?: string;
  description?: string;
  onExport?: () => void;
}

export function MyDataTableMaster<TData>({
  columns,
  data,
  searchPlaceholder = 'Cari semua kolom...',
  isLoading,
  initialPageSize = 10,
  title = '',
  description = '',
  onExport,
}: MyDataTableMasterProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: 'onChange',
    onColumnSizingChange: setColumnSizing,
    state: {
      sorting,
      globalFilter,
      columnSizing,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
    },
  });

  const numberOfColumns = columns.length;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === '/' &&
        (event.target as HTMLElement).tagName !== 'INPUT'
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white px-10 pt-7 pb-2 rounded-2xl">
        {title.trim() && (
          <div className="flex flex-row justify-between">
            <div className="flex flex-col mb-7 gap-1">
              <div className="flex flex-row gap-2">
                <p className="font-semibold text-xl text-blue-400">{title}</p>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-5 h-5 text-blue-300 mt-1" />
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center" sideOffset={-2}>
                    <p>Navigate to page in description link</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <div>
              {onExport && (
                <Button
                  variant="ghost"
                  className="justify-between font-normal bg-gray-100 text-gray-400 hover:text-blue-400 rounded-full cursor-pointer"
                  onClick={onExport}
                >
                  Export to XLSX
                  <FileSpreadsheet className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center mb-5">
          <Input
            ref={searchInputRef}
            placeholder={searchPlaceholder}
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Kolom <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {(column.columnDef.meta as any)?.displayName || column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border bg-white text-black">
          <Table className="w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-gray-700">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-black relative"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        <div
                          {...{
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                          }}
                          className={`absolute top-0 right-0 h-full w-1 cursor-col-resize select-none touch-none bg-gray-300 transition-colors ${
                            header.column.getIsResizing() ? 'bg-blue-500' : ''
                          }`}
                        />
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={numberOfColumns}
                    className="h-24 text-center"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      <span>Memuat data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-gray-700">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-400 whitespace-normal break-words"
                  >
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 py-4">
          <div className="text-sm text-gray-400 w-full sm:w-auto">
            Halaman {table.getState().pagination.pageIndex + 1} dari{' '}
            {table.getPageCount()}
          </div>
          <div className="flex-grow hidden sm:block"></div>
          <div className="flex items-center justify-end space-x-2">
            <Button
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="bg-blue-300 hover:bg-blue-200 disabled:opacity-50"
            >
              Sebelumnya
            </Button>
            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="bg-blue-300 hover:bg-blue-200 disabled:opacity-50"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
