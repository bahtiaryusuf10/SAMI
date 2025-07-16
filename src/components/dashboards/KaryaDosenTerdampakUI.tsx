'use client';

import BubbleChat from '@/components/forms/BubbleChat';
import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { DashboardSettings } from '../settings/DashboardSettings';
import { ShareButton } from '../ShareButton';
import { QuickFilter } from '../settings/QuickFilter';
import { AlertTriangle, Globe, Loader2, Search, Users } from 'lucide-react';
import { MySingleValueChart } from '../charts/MySingleValueChart';

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface InfoAgregatKaryaDosen {
  rasio_publikasi_dari_penelitian: number;
  rasio_publikasi_dari_pkm: number;
  persentase_publikasi_terindeks_scopus_wos: number;
}

interface DashboardData {
  infoAgregatKaryaDosen: DataState<InfoAgregatKaryaDosen>;
}

interface KaryaDosenTerdampakUIProps {
  pageKey: string;
  dashboardData: DashboardData;
  isPublicView?: boolean;
  initialActiveYear?: number | null;
}

export function KaryaDosenTerdampakUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: KaryaDosenTerdampakUIProps): JSX.Element {
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

  const { infoAgregatKaryaDosen } = dashboardData;

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
                Karya Dosen Terdampak
              </h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  IKU 5 Hasil kerja dosen digunakan oleh masyarakat atau
                  mendapat rekognisi internasional.
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
                  apiUrl="/api/public/filters/tahun-laporan-mahasiswa"
                  activeValue={activeReportingYear}
                  onValueChange={handleValueChange}
                  showAllOption={false}
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
                {infoAgregatKaryaDosen.isLoading ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : infoAgregatKaryaDosen.error ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <p className="ml-2 text-red-400 text-md">
                      Gagal memuat data.
                    </p>
                  </div>
                ) : (
                  <>
                    {/*INFO STATISTIK MAHASISWA*/}
                    <MySingleValueChart
                      icon={<Search className="h-10 w-10 text-blue-400" />}
                      label="Publikasi dari Penelitian"
                      value={
                        infoAgregatKaryaDosen.data
                          ?.rasio_publikasi_dari_penelitian ?? 0
                      }
                      targetLabel="/ 1"
                      targetValue={1}
                    />
                    <MySingleValueChart
                      icon={<Users className="h-10 w-10 text-blue-400" />}
                      label="Publikasi dari PkM"
                      value={parseFloat(
                        (
                          infoAgregatKaryaDosen.data
                            ?.rasio_publikasi_dari_pkm ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 0.1"
                      targetValue={0.1}
                    />
                    <MySingleValueChart
                      icon={<Globe className="h-10 w-10 text-blue-400" />}
                      label="Terindeks Scopus/WOS"
                      value={parseFloat(
                        (
                          infoAgregatKaryaDosen.data
                            ?.persentase_publikasi_terindeks_scopus_wos ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 25%"
                      targetValue={25}
                    />
                  </>
                )}
              </div>
              {!isPublicView && (
                <div className="flex flex-wrap gap-4">
                  <ImportDialog type="journal_conferences" />
                </div>
              )}
            </div>
          </div>
        </div>
        {!isPublicView && <BubbleChat />}
      </>
    </DashboardProvider>
  );
}
