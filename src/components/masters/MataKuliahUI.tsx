'use client';

import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { QuickFilter } from '../settings/QuickFilter';
import { PageHeader } from '@/components/layout/PageHeader';
import { MyDataTableMaster } from '../tables/MyDataTableMaster';
import { ColumnDef } from '@tanstack/react-table';
import { FileText, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useUser } from '@/contexts/UserContext';
import { SortableHeader } from '@/components/tables/SortableHeader';

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface MataKuliah {
  course_id: string;
  name: string;
  in_semester: number;
  learning_method: string;
  package_category: string;
}

interface DataImportLog {
  source_url: string;
  file_name: string;
  import_type: string;
}

interface Data {
  dataMataKuliah: DataState<MataKuliah[]>;
  importLog?: DataState<DataImportLog[]>;
}

interface MataKuliahUIProps {
  pageKey: string;
  data: Data;
  isPublicView?: boolean;
  initialActiveYear?: number | null;
}

const courseColumns: ColumnDef<MataKuliah>[] = [
  {
    accessorKey: 'course_id',
    size: 180,
    minSize: 140,
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Kode Mata Kuliah" />
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('course_id')}</div>;
    },
    meta: {
      displayName: 'Kode Mata Kuliah',
    },
  },
  {
    accessorKey: 'name',
    size: 200,
    minSize: 140,
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Nama Mata Kuliah" />
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className="text-left whitespace-normal break-words line-clamp-2"
          title={row.getValue('name')}
        >
          {row.getValue('name')}
        </div>
      );
    },
    meta: {
      displayName: 'Nama Mata Kuliah',
    },
  },
  {
    accessorKey: 'in_semester',
    size: 90,
    minSize: 80,
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Semester" />
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('in_semester')}</div>;
    },
    meta: {
      displayName: 'Semester',
    },
  },
  {
    accessorKey: 'learning_method',
    size: 210,
    minSize: 160,
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Metode Pembelajaran" />
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className="text-center font-medium whitespace-normal break-words line-clamp-2"
          title={row.getValue('learning_method')}
        >
          {row.getValue('learning_method')}
        </div>
      );
    },
    meta: {
      displayName: 'Metode Pembelajaran',
    },
  },
  {
    accessorKey: 'package_category',
    size: 120,
    minSize: 100,
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Kategori" />
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className="text-center truncate"
          title={row.getValue('package_category')}
        >
          {row.getValue('package_category')}
        </div>
      );
    },
    meta: {
      displayName: 'Kategori',
    },
  },
];

export function MataKuliahUI({
  pageKey,
  isPublicView = false,
  data,
  initialActiveYear = null,
}: MataKuliahUIProps): JSX.Element {
  // Permission
  const { can } = useUser();

  // Filter
  const activeReportingYear =
    useDashboardSettingsStore(
      (state) => state.pageSettings[pageKey]?.activeReportingYear
    ) ?? null;

  const setActiveYear = useDashboardSettingsStore(
    (state) => state.setActiveReportingYear
  );

  const handleValueChange = (newYear: string) => {
    setActiveYear(pageKey, newYear === 'all' ? null : parseInt(newYear));
  };

  const { dataMataKuliah, importLog } = data;

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <PageHeader
            title="Data Mata Kuliah"
            description="Berikut adalah daftar mata kuliah Program Studi Ilmu Komputer."
            actions={
              isPublicView ? (
                <div className="text-white bg-white/30 px-4 py-2 rounded-lg text-sm">
                  <span className="font-normal">Data : </span>
                  <span className="font-bold">
                    {initialActiveYear
                      ? `Tahun ${initialActiveYear}`
                      : 'Semua Tahun'}
                  </span>
                </div>
              ) : (
                <QuickFilter
                  label="Tahun"
                  apiUrl="/api/mata-kuliah/filter"
                  activeValue={activeReportingYear}
                  onValueChange={handleValueChange}
                  showAllOption={false}
                />
              )
            }
          />
          <div className="px-2 py-0 flex flex-col gap-4 mb-8">
            <div className="w-full">
              <div className="px-1 mb-5">
                <MyDataTableMaster
                  columns={courseColumns}
                  data={dataMataKuliah.data || []}
                  searchPlaceholder="Cari Nama atau Kode Mata Kuliah [ / ]"
                  isLoading={dataMataKuliah.isLoading}
                />
              </div>
              {!isPublicView && (
                <div className="flex w-full flex-col items-end gap-2 mt-3 sm:flex-row sm:items-center sm:justify-end-safe sm:gap-4">
                  {can('import:data') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Import Data
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="bg-white text-black shadow-md border border-gray-200 rounded-md"
                        align="end"
                        sideOffset={8}
                      >
                        <DropdownMenuLabel className="font-medium text-blue-400">
                          Pilih Jenis Data
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="p-0 my-2 mx-1"
                        >
                          <ImportDialog type="courses" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {!importLog?.isLoading &&
                    importLog?.data &&
                    importLog?.data.length > 0 &&
                    can('view:source_url') && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Lihat Sumber Data
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="bg-white text-black shadow-md border border-gray-200 rounded-md p-2"
                          align="end"
                          sideOffset={8}
                        >
                          <DropdownMenuLabel className="font-medium text-blue-400 mb-1">
                            Sumber Data
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {importLog?.data.map((link, index) => (
                            <a
                              key={index}
                              href={link.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <DropdownMenuItem className="hover:!bg-blue-300 cursor-pointer transition-colors text-blue-400 p-2 rounded-md text-sm mb-1 hover:!text-white">
                                {link.file_name}
                              </DropdownMenuItem>
                            </a>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </DashboardProvider>
  );
}
