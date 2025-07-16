'use client';

import BubbleChat from '@/components/forms/BubbleChat';
// import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { ShareButton } from '../ShareButton';
import { DashboardSettings } from '../settings/DashboardSettings';
import { QuickFilter } from '../settings/QuickFilter';
import { MySingleValueChart } from '../charts/MySingleValueChart';
import { AlertTriangle, Book, Loader2, Puzzle, User } from 'lucide-react';

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface InfoAgregatKelasKolaboratif {
  jumlah_mata_kuliah: number;
  persentase_mata_kuliah_case_dan_team: number;
  jumlah_dosen_pengajar_mata_kuliah_case_dan_team: number;
}

interface DashboardData {
  infoAgregatKelasKolaboratif: DataState<InfoAgregatKelasKolaboratif>;
}

interface KelasKolaboratifUIProps {
  pageKey: string;
  dashboardData: DashboardData;
  isPublicView?: boolean;
  initialActiveYear?: number | null;
}

export function KelasKolaboratifUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: KelasKolaboratifUIProps): JSX.Element {
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

  const { infoAgregatKelasKolaboratif } = dashboardData;

  // Dashboard Settings
  const pageSettings = useDashboardSettingsStore(
    (state) => state.pageSettings[pageKey]
  );

  const { theme, showLabels } = pageSettings || {
    theme: 'pastel1',
    showLabels: true,
  };

  const setPageTheme = useDashboardSettingsStore((state) => state.setPageTheme);
  const setPageShowLabels = useDashboardSettingsStore(
    (state) => state.setPageShowLabels
  );

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <div className="flex w-full items-center justify-between px-2 pt-2 mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold text-white">
                Kelas Kolaboratif
              </h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  IKU 7 Kelas yang kolaboratif dan partisipatif.
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
                  apiUrl="/api/public/filters/tahun-laporan-dosen"
                  activeValue={activeReportingYear}
                  onValueChange={handleValueChange}
                />
              )}
              <DashboardSettings
                pageKey={pageKey}
                theme={theme}
                showLabels={showLabels}
                setPageTheme={setPageTheme}
                setPageShowLabels={setPageShowLabels}
              />
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
                {infoAgregatKelasKolaboratif.isLoading ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : infoAgregatKelasKolaboratif.error ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <p className="ml-2 text-red-400 text-md">
                      Gagal memuat data.
                    </p>
                  </div>
                ) : (
                  <>
                    {/*INFO STATISTIK LULUSAN*/}
                    <MySingleValueChart
                      icon={<Book className="h-10 w-10 text-blue-400" />}
                      label="Mata Kuliah"
                      value={
                        infoAgregatKelasKolaboratif.data?.jumlah_mata_kuliah ??
                        0
                      }
                      targetLabel=""
                    />
                    <MySingleValueChart
                      icon={<Puzzle className="h-10 w-10 text-blue-400" />}
                      label="Case Method & Project"
                      value={parseFloat(
                        (
                          infoAgregatKelasKolaboratif.data
                            ?.persentase_mata_kuliah_case_dan_team ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 95%"
                      targetValue={95}
                    />
                    <MySingleValueChart
                      icon={<User className="h-10 w-10 text-blue-400" />}
                      label="Dosen Pengajar"
                      value={
                        infoAgregatKelasKolaboratif.data
                          ?.jumlah_dosen_pengajar_mata_kuliah_case_dan_team ?? 0
                      }
                      targetLabel=""
                    />
                  </>
                )}
              </div>
              {/* {!isPublicView && (
                <div className="flex flex-wrap gap-4">
                  <ImportDialog type="courses" />
                </div>
              )} */}
            </div>
          </div>
        </div>
        {!isPublicView && <BubbleChat />}
      </>
    </DashboardProvider>
  );
}
