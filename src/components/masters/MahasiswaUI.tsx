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

interface Mahasiswa {
  student_id: string;
  name: string;
  cohort_year: number;
  gpa: string;
  study_duration_semester: number;
  status: string;
}

interface DataImportLog {
  source_url: string;
  file_name: string;
  import_type: string;
}

interface Data {
  dataMahasiswa: DataState<Mahasiswa[]>;
  importLog?: DataState<DataImportLog[]>;
}

interface MahasiswaUIProps {
  pageKey: string;
  data: Data;
  isPublicView?: boolean;
  initialActiveYear?: number | null;
}

const studentColumns: ColumnDef<Mahasiswa>[] = [
  {
    accessorKey: 'student_id',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="NIM" />
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('student_id')}</div>;
    },
    meta: {
      displayName: 'NIM',
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Nama Mahasiswa" />
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
      displayName: 'Nama Mahasiswa',
    },
  },
  {
    accessorKey: 'cohort_year',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Angkatan" />
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('cohort_year')}</div>;
    },
    meta: {
      displayName: 'Angkatan',
    },
  },
  {
    accessorKey: 'gpa',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="IPK" />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue('gpa')}</div>
      );
    },
    meta: {
      displayName: 'IPK',
    },
  },
  {
    accessorKey: 'study_duration_semester',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Lama Studi" />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue('study_duration_semester')}
        </div>
      );
    },
    meta: {
      displayName: 'Lama Studi',
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Status" />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center truncate" title={row.getValue('status')}>
          {row.getValue('status')}
        </div>
      );
    },
  },
];

export function MahasiswaUI({
  pageKey,
  isPublicView = false,
  data,
  initialActiveYear = null,
}: MahasiswaUIProps): JSX.Element {
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

  const { dataMahasiswa, importLog } = data;

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <PageHeader
            title="Data Mahasiswa"
            description="Berikut adalah daftar mahasiswa yang berstatus Terdaftar dan Cuti."
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
                  apiUrl="/api/mahasiswa/filter"
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
                  columns={studentColumns}
                  data={dataMahasiswa.data || []}
                  searchPlaceholder="Cari Nama atau NIM [ / ]"
                  isLoading={dataMahasiswa.isLoading}
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
                          <ImportDialog type="students" />
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
