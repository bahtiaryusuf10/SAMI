'use client';

import BubbleChat from '@/components/forms/BubbleChat';
import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { QuickFilter } from '../settings/QuickFilter';
import { DashboardSettings } from '../settings/DashboardSettings';
import { ShareButton } from '../ShareButton';
import { MySingleValueChart } from '../charts/MySingleValueChart';
import {
  AlertTriangle,
  BadgeCheck,
  GraduationCap,
  Loader2,
  Rocket,
  User,
} from 'lucide-react';

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface InfoAgregatPraktisi {
  persentase_praktisi_mengajar: number;
  persentase_dosen_berkualifikasi_s3: number;
  persentase_dosen_bersertifikat_profesi: number;
  persentase_dosen_menjadi_praktisi: number;
}

interface DashboardData {
  infoAgregatPraktisi: DataState<InfoAgregatPraktisi>;
}

interface PraktisiMengajarUIProps {
  pageKey: string;
  dashboardData: DashboardData;
  isPublicView?: boolean;
  initialActiveYear?: number | null;
}

export function PraktisiMengajarUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: PraktisiMengajarUIProps): JSX.Element {
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

  const { infoAgregatPraktisi } = dashboardData;

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
                Praktisi Mengajar
              </h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  IKU 4 Praktisi mengajar di dalam kampus.
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
                {infoAgregatPraktisi.isLoading ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : infoAgregatPraktisi.error ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <p className="ml-2 text-red-400 text-md">
                      Gagal memuat data.
                    </p>
                  </div>
                ) : (
                  <>
                    {/*INFO STATISTIK PRAKTISI*/}
                    <MySingleValueChart
                      icon={<User className="h-10 w-10 text-blue-400" />}
                      label="Praktisi Mengajar"
                      value={parseFloat(
                        (
                          infoAgregatPraktisi.data
                            ?.persentase_praktisi_mengajar ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 20%"
                      targetValue={20}
                    />
                    <MySingleValueChart
                      icon={
                        <GraduationCap className="h-10 w-10 text-blue-400" />
                      }
                      label="Berkualifikasi S3"
                      value={parseFloat(
                        (
                          infoAgregatPraktisi.data
                            ?.persentase_dosen_berkualifikasi_s3 ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 80%"
                      targetValue={80}
                    />
                    <MySingleValueChart
                      icon={<BadgeCheck className="h-10 w-10 text-blue-400" />}
                      label="Sertifikat Profesi"
                      value={parseFloat(
                        (
                          infoAgregatPraktisi.data
                            ?.persentase_dosen_bersertifikat_profesi ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 80%"
                      targetValue={80}
                    />
                    <MySingleValueChart
                      icon={<Rocket className="h-10 w-10 text-blue-400" />}
                      label="Praktisi (Flagship)"
                      value={parseFloat(
                        (
                          infoAgregatPraktisi.data
                            ?.persentase_dosen_menjadi_praktisi ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 20%"
                      targetValue={20}
                    />
                  </>
                )}
              </div>
              {!isPublicView && (
                <div className="flex flex-wrap gap-4">
                  {/* <ImportDialog type="lecturers" /> */}
                  <ImportDialog type="practitioner_teachings" />
                  <ImportDialog type="field_experiences" />
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
