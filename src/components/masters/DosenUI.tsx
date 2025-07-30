'use client';

import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { QuickFilter } from '../settings/QuickFilter';
import { MyDataTableMaster } from '../tables/MyDataTableMaster';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Check, FileText, Upload, X } from 'lucide-react';
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

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface Dosen {
  lecturer_id: string;
  name: string;
  highest_qualification: string;
  has_professional_cert: string;
  academic_rank: string;
}

interface DataImportLog {
  source_url: string;
  file_name: string;
  import_type: string;
}

interface Data {
  dataDosen: DataState<Dosen[]>;
  importLog?: DataState<DataImportLog[]>;
}

interface DosenUIProps {
  pageKey: string;
  data: Data;
  isPublicView?: boolean;
  initialActiveYear?: number | null;
}

const lecturerColumns: ColumnDef<Dosen>[] = [
  {
    accessorKey: 'lecturer_id',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            NIDN/NIDK
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('lecturer_id')}</div>;
    },
    meta: {
      displayName: 'NIDN/NIDK',
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nama Dosen
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
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
      displayName: 'Nama Dosen',
    },
  },
  {
    accessorKey: 'highest_qualification',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Pendidikan Tertinggi
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue('highest_qualification')}
        </div>
      );
    },
    meta: {
      displayName: 'Pendidikan Tertinggi',
    },
  },
  {
    accessorKey: 'has_professional_cert',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Sertifikat Profesional
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue('has_professional_cert') == 1 ? (
            <Check className="mx-auto text-green-500" size={18} />
          ) : (
            <X className="mx-auto text-red-500" size={18} />
          )}
        </div>
      );
    },
    meta: {
      displayName: 'Sertifikat Profesional',
    },
  },
  {
    accessorKey: 'academic_rank',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Jabatan Akademik
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('academic_rank')}</div>;
    },
    meta: {
      displayName: 'Jabatan Akademik',
    },
  },
];

export function DosenUI({
  pageKey,
  isPublicView = false,
  data,
  initialActiveYear = null,
}: DosenUIProps): JSX.Element {
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

  const { dataDosen, importLog } = data;

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <div className="flex w-full items-center justify-between px-2 pt-2 mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold text-white">Data Dosen</h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  Berikut adalah daftar dosen tetap Program Studi Ilmu Komputer.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPublicView ? (
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
                  // apiUrl="/api/dosen/filter"
                  apiUrl="/api/public/filters/tahun-laporan"
                  activeValue={activeReportingYear}
                  onValueChange={handleValueChange}
                  showAllOption={false}
                />
              )}
            </div>
          </div>
          <div className="px-2 py-0 flex flex-col gap-4 mb-8">
            <div className="w-full">
              <div className="px-1 mb-5">
                <MyDataTableMaster
                  columns={lecturerColumns}
                  data={dataDosen.data || []}
                  searchPlaceholder="Cari berdasarkan Nama atau NIDN/NIDK [ / ]"
                  isLoading={dataDosen.isLoading}
                />
              </div>
              {!isPublicView && (
                <div className="flex w-full items-center justify-end-safe mt-3 gap-4">
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
                          <ImportDialog type="lecturers" />
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
