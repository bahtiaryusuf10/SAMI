'use client';

import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { QuickFilter } from '../settings/QuickFilter';
import { ShareButton } from '../ShareButton';
import { MySingleValueChart } from '../charts/MySingleValueChart';
import {
  AlertTriangle,
  FileText,
  Globe,
  Loader2,
  Medal,
  Upload,
} from 'lucide-react';
import { PdfViewer } from '../PdfViewer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { useUser } from '@/contexts/UserContext';
import { ExecutiveSummary } from '../ExecutiveSummary';

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface Akreditasi {
  level: string;
  index: string;
  proof_url: string;
}

interface DataImportLog {
  source_url: string;
  file_name: string;
  import_type: string;
}

interface DashboardData {
  infoAkreditasi: DataState<Akreditasi[]>;
  importLog?: DataState<DataImportLog[]>;
}

interface StandarInternasionalUIProps {
  pageKey: string;
  dashboardData: DashboardData;
  isPublicView?: boolean;
  initialActiveYear?: number | null;
}

export function StandarInternasionalUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: StandarInternasionalUIProps): JSX.Element {
  // Permission
  const { can } = useUser();

  // Filter
  const zustandActiveYear =
    useDashboardSettingsStore(
      (state) => state.pageSettings[pageKey]?.activeReportingYear
    ) ?? null;

  const setActiveYear = useDashboardSettingsStore(
    (state) => state.setActiveReportingYear
  );

  const activeReportingYear = isPublicView
    ? initialActiveYear
    : zustandActiveYear;

  const handleValueChange = (newYear: string) => {
    setActiveYear(pageKey, newYear === 'all' ? null : parseInt(newYear));
  };

  const { infoAkreditasi, importLog } = dashboardData;

  const summaryData = {
    infoAkreditasi: infoAkreditasi.data,
  };

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <div className="flex w-full items-center justify-between px-2 pt-2 mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold text-white">
                Standar Internasional
              </h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  IKU 8 Program studi berstandar internasional.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPublicView ? (
                <div className="text-white bg-white/30 px-4 py-2 rounded-lg text-sm">
                  <span className="font-normal">Data : </span>
                  <span className="font-bold">
                    {initialActiveYear
                      ? `Tahun Laporan ${initialActiveYear}`
                      : 'Semua Tahun'}
                  </span>
                </div>
              ) : (
                <QuickFilter
                  label="Tahun Laporan"
                  apiUrl="/api/public/filters/tahun-laporan-by-tipe?types=accreditations"
                  activeValue={activeReportingYear}
                  onValueChange={handleValueChange}
                  showAllOption={false}
                />
              )}
              {!isPublicView && (
                <ShareButton
                  dashboardId={pageKey}
                  activeFilterValue={activeReportingYear}
                  filterQueryParamName="year"
                />
              )}
            </div>
          </div>
          <div className="px-2 py-0 flex flex-col gap-4 mb-8">
            <div className="w-full">
              <div className="flex flex-wrap gap-4">
                {infoAkreditasi.isLoading ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : infoAkreditasi.error ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <p className="ml-2 text-red-400 text-md">
                      Gagal memuat data.
                    </p>
                  </div>
                ) : (
                  <>
                    {/*INFO AKREDITASI*/}
                    <MySingleValueChart
                      icon={<Globe className="h-10 w-10 text-blue-400" />}
                      label="Internasional"
                      valueString={
                        infoAkreditasi.data?.find(
                          (acc) => acc.level === 'Internasional'
                        )?.index ?? 'N/A'
                      }
                      targetLabel=""
                    />
                    <MySingleValueChart
                      icon={<Medal className="h-10 w-10 text-blue-400" />}
                      label="Nasional"
                      valueString={
                        infoAkreditasi.data?.find(
                          (acc) => acc.level === 'Nasional'
                        )?.index ?? 'N/A'
                      }
                      targetLabel=""
                    />
                  </>
                )}
              </div>
              <div className="-mx-4">
                <div className="flex flex-row px-4 my-4 gap-4">
                  <PdfViewer
                    url={
                      infoAkreditasi.data?.find(
                        (acc) => acc.level === 'Internasional'
                      )?.proof_url
                    }
                    title="Sertifikat Akreditasi Internasional"
                  />
                  <PdfViewer
                    url={
                      infoAkreditasi.data?.find(
                        (acc) => acc.level === 'Nasional'
                      )?.proof_url
                    }
                    title="Sertifikat Akreditasi Nasional"
                  />
                </div>
              </div>
              {!isPublicView && (
                <div className="flex w-full items-start justify-end-safe px-2 mt-3 gap-2">
                  <div className="flex items-center gap-2">
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
                            <ImportDialog type="accreditations" />
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
                  <div>
                    <ExecutiveSummary
                      pageKey={pageKey}
                      dataForSummary={summaryData}
                      activeReportingYear={activeReportingYear}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </DashboardProvider>
  );
}
