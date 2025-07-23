'use client';

import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { QuickFilter } from '../settings/QuickFilter';
import { MyDataTableMaster } from '../tables/MyDataTableMaster';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, FileText, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            NIM
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
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
        <div className="text-left w-[210px]">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nama Mahasiswa
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className="text-left truncate w-[210px]"
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
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Angkatan
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
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
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            IPK
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
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
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Lama Studi
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
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
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('status')}</div>;
    },
  },
];

export function MahasiswaUI({
  pageKey,
  isPublicView = false,
  data,
  initialActiveYear = null,
}: MahasiswaUIProps): JSX.Element {
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
          <div className="flex w-full items-center justify-between px-2 pt-2 mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold text-white">
                Data Mahasiswa
              </h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  Berikut adalah daftar mahasiswa yang berstatus Terdaftar dan
                  Cuti.
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
                  apiUrl="/api/mahasiswa/filter"
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
                  columns={studentColumns}
                  data={dataMahasiswa.data || []}
                  searchPlaceholder="Cari berdasarkan Nama atau NIM [ / ]"
                  isLoading={dataMahasiswa.isLoading}
                />
              </div>
              {!isPublicView && (
                <div className="flex w-full items-center justify-end-safe mt-3 gap-4">
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

                  {!importLog?.isLoading &&
                    importLog?.data &&
                    importLog?.data.length > 0 && (
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
