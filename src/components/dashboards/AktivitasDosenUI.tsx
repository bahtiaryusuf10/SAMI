'use client';

import BubbleChat from '@/components/forms/BubbleChat';
import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { QuickFilter } from '../settings/QuickFilter';
import { DashboardSettings } from '../settings/DashboardSettings';
import { ShareButton } from '../ShareButton';
import {
  AlertTriangle,
  BookOpenCheck,
  Loader2,
  User,
  UserCheck,
} from 'lucide-react';
import { MySingleValueChart } from '../charts/MySingleValueChart';
import { MyBarChart } from '../charts/MyBarChart';
import { useMemo } from 'react';
import { DashboardGridLayout } from '../DashboardGridLayout';

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface ChartDataBar {
  label: string;
  value: number;
}

interface InfoAgregatAktivitasDosen {
  persentase_tridarma_di_luar_kampus: number;
  jumlah_dosen_tetap_program_studi: number;
  persentase_membina_mahasiswa: number;
}

interface DashboardData {
  infoAgregatAktivitasDosen: DataState<InfoAgregatAktivitasDosen>;
  distribusiAktivitasDosen: DataState<ChartDataBar>;
  distribusiAktivitasMengajarDosen: DataState<ChartDataBar>;
}

interface AktivitasDosenUIProps {
  pageKey: string;
  dashboardData: DashboardData;
  isPublicView?: boolean;
  initialActiveYear?: number | null;
}

interface DashboardConfigItem {
  id: string;
  title: string;
  type: 'small' | 'medium' | 'large';
  isPercentage?: boolean;
  isDrillDown?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartProps?: Record<string, any>;
}

const dashboardConfig: DashboardConfigItem[] = [
  {
    id: 'distribusi-aktivitas-dosen',
    title: 'Proporsi Aktivitas Dosen',
    type: 'medium',
    component: MyBarChart,
    chartProps: {
      dataKeys: ['value'],
      indexBy: 'label',
      axisBottomLegend: 'Jenis Aktivitas',
      axisLeftLegend: 'Persentase (%)',
    },
  },
  {
    id: 'distribusi-aktivitas-mengajar-dosen',
    title: 'Aktivitas Mengajar di Luar Kampus',
    type: 'medium',
    component: MyBarChart,
    chartProps: {
      dataKeys: ['value'],
      indexBy: 'label',
      axisBottomLegend: 'Tempat Mengajar',
      axisLeftLegend: 'Persentase (%)',
    },
  },
] as const;

type DashboardId = (typeof dashboardConfig)[number]['id'];

export function AktivitasDosenUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: AktivitasDosenUIProps): JSX.Element {
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

  const {
    infoAgregatAktivitasDosen,
    distribusiAktivitasDosen,
    distribusiAktivitasMengajarDosen,
  } = dashboardData;

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

  // Chart Component
  const chartChildren = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataStateMap: Record<DashboardId, DataState<any>> = {
      'distribusi-aktivitas-dosen': distribusiAktivitasDosen,
      'distribusi-aktivitas-mengajar-dosen': distribusiAktivitasMengajarDosen,
    };

    const dynamicDescription = `Data untuk tahun laporan ${activeReportingYear}`;

    return dashboardConfig.map((config) => {
      const ChartComponent = config.component;
      const chartState = dataStateMap[config.id];
      const chartProps = { ...(config.chartProps ?? {}) };

      if (!chartState) return null;

      return (
        <ChartComponent
          key={config.id}
          title={config.title}
          type={config.type as 'small' | 'medium' | 'large'}
          isPercentage={config.isPercentage}
          drillDown={config.isDrillDown}
          description={dynamicDescription}
          data={chartState.data || []}
          isLoading={chartState.isLoading}
          error={chartState.error}
          pageKey={pageKey}
          chartId={config.id}
          colorScheme={theme}
          enableLabel={showLabels}
          enableArcLabels={showLabels}
          {...chartProps}
        />
      );
    });
  }, [
    distribusiAktivitasDosen,
    distribusiAktivitasMengajarDosen,
    activeReportingYear,
    pageKey,
    theme,
    showLabels,
  ]);

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <div className="flex w-full items-center justify-between px-2 pt-2 mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold text-white">
                Aktivitas Dosen
              </h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  IKU 3 Dosen berkegiatan di luar kampus.
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
                {infoAgregatAktivitasDosen.isLoading ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : infoAgregatAktivitasDosen.error ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <p className="ml-2 text-red-400 text-md">
                      Gagal memuat data.
                    </p>
                  </div>
                ) : (
                  <>
                    {/*INFO STATISTIK AKTIVITAS DOSEN*/}
                    <MySingleValueChart
                      icon={<User className="h-10 w-10 text-blue-400" />}
                      label="Dosen Tetap"
                      value={
                        infoAgregatAktivitasDosen.data
                          ?.jumlah_dosen_tetap_program_studi ?? 0
                      }
                      targetLabel=""
                    />
                    <MySingleValueChart
                      icon={
                        <BookOpenCheck className="h-10 w-10 text-blue-400" />
                      }
                      label="Tridarma Kampus QS100"
                      value={parseFloat(
                        (
                          infoAgregatAktivitasDosen.data
                            ?.persentase_tridarma_di_luar_kampus ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 20%"
                      targetValue={20}
                    />
                    <MySingleValueChart
                      icon={<UserCheck className="h-10 w-10 text-blue-400" />}
                      label="Membina Lomba"
                      value={parseFloat(
                        (
                          infoAgregatAktivitasDosen.data
                            ?.persentase_membina_mahasiswa ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 20%"
                      targetValue={20}
                    />
                  </>
                )}
              </div>
              <div className="-mx-4">
                <DashboardGridLayout pageKey={pageKey}>
                  {chartChildren}
                </DashboardGridLayout>
              </div>
              {!isPublicView && (
                <div className="flex flex-wrap gap-4">
                  <ImportDialog type="detasering_activities" />
                  <ImportDialog type="teach_activities" />
                  <ImportDialog type="research_services" />
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
