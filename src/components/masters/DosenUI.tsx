'use client';

import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { QuickFilter } from '../settings/QuickFilter';
import { PageHeader } from '@/components/layout/PageHeader';
import { MyDataTableMaster } from '../tables/MyDataTableMaster';
import { ColumnDef } from '@tanstack/react-table';
import { Check, FileText, Upload, X } from 'lucide-react';
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
        <SortableHeader column={column} label="NIDN/NIDK" />
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
        <SortableHeader column={column} label="Nama Dosen" />
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
        <SortableHeader column={column} label="Pendidikan Tertinggi" />
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
        <SortableHeader column={column} label="Sertifikat Profesional" />
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
        <SortableHeader column={column} label="Jabatan Akademik" />
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className="text-center truncate"
          title={row.getValue('academic_rank')}
        >
          {row.getValue('academic_rank')}
        </div>
      );
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
          <PageHeader
            title="Data Dosen"
            description="Berikut adalah daftar dosen tetap Program Studi Ilmu Komputer."
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
                  apiUrl="/api/dosen/filter"
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
                  columns={lecturerColumns}
                  data={dataDosen.data || []}
                  searchPlaceholder="Cari Nama atau NIDN/NIDK [ / ]"
                  isLoading={dataDosen.isLoading}
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
