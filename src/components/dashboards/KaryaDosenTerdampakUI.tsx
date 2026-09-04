'use client';

import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { DashboardSettings } from '../settings/DashboardSettings';
import { PageHeader } from '@/components/layout/PageHeader';
import { ShareButton } from '../ShareButton';
import { QuickFilter } from '../settings/QuickFilter';
import {
  AlertTriangle,
  FileText,
  Globe,
  Loader2,
  Search,
  Upload,
  Users,
} from 'lucide-react';
import { MySingleValueChart } from '../charts/MySingleValueChart';
import { MyPieChart } from '../charts/MyPieChart';
import { useCallback, useMemo, useState } from 'react';
import { DashboardGridLayout } from '../DashboardGridLayout';
import { MyBarChart } from '../charts/MyBarChart';
import { MyLineChart } from '../charts/MyLineChart';
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

interface ChartDataBar {
  label: string;
  value: number;
}

interface ChartDataPie {
  id: string;
  label: string;
  value: number;
}

interface ChartDataLine {
  id: string;
  data: {
    x: string | number;
    y: number;
  }[];
}

interface DataImportLog {
  source_url: string;
  file_name: string;
  import_type: string;
}

interface InfoAgregatKaryaDosen {
  rasio_publikasi_dari_penelitian: number;
  rasio_publikasi_dari_pkm: number;
  persentase_publikasi_terindeks_scopus_wos: number;
}

interface DashboardData {
  infoAgregatKaryaDosen: DataState<InfoAgregatKaryaDosen>;
  distribusiTingkatPublikasi: DataState<ChartDataPie>;
  trenPublikasiPerTahun: DataState<ChartDataLine>;
  trenSitasiPerDosen: DataState<ChartDataLine>;
  top5DosenPublikasi: DataState<ChartDataBar>;
  importLog?: DataState<DataImportLog[]>;
}

interface KaryaDosenTerdampakUIProps {
  pageKey: string;
  dashboardData: DashboardData;
  isPublicView?: boolean;
  initialActiveYear?: number | null;
}

interface DashboardConfigItem {
  id: string;
  title: string;
  type: 'small' | 'semiMedium' | 'medium' | 'semiLarge' | 'large' | 'full';
  isPercentage?: boolean;
  isDrillDown?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartProps?: Record<string, any>;
}

const dashboardConfig: DashboardConfigItem[] = [
  {
    id: 'distribusi-tingkat-publikasi',
    title: 'Proporsi Tingkat Publikasi',
    type: 'medium',
    isPercentage: true,
    isDrillDown: true,
    component: MyPieChart,
  },
  {
    id: 'tren-publikasi-per-tahun',
    title: 'Tren Publikasi Dosen',
    type: 'medium',
    component: MyLineChart,
    chartProps: {
      axisLeftLegend: 'Jumlah Publikasi',
      axisBottomLegend: 'Tahun',
    },
  },
  {
    id: 'tren-sitasi-per-dosen',
    title: 'Top 5 Dosen Sitasi Terbanyak',
    type: 'medium',
    component: MyLineChart,
    chartProps: {
      axisLeftLegend: 'Jumlah Sitasi',
      axisBottomLegend: 'Tahun',
    },
  },
  {
    id: 'top5-dosen-publikasi',
    title: 'Top 5 Dosen Melakukan Publikasi',
    type: 'medium',
    component: MyBarChart,
    chartProps: {
      layout: 'horizontal',
      grouped: 'stacked',
      indexBy: 'lecturer_name',
      axisBottomLegend: 'Nama Dosen',
      axisLeftLegend: 'Jumlah Publikasi',
    },
  },
] as const;

type DashboardId = (typeof dashboardConfig)[number]['id'];

export function KaryaDosenTerdampakUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: KaryaDosenTerdampakUIProps): JSX.Element {
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

  const {
    infoAgregatKaryaDosen,
    distribusiTingkatPublikasi,
    trenPublikasiPerTahun,
    trenSitasiPerDosen,
    top5DosenPublikasi,
    importLog,
  } = dashboardData;

  const summaryData = {
    infoAgregatKaryaDosen: infoAgregatKaryaDosen.data,
    distribusiTingkatPublikasi: distribusiTingkatPublikasi.data,
    trenPublikasiPerTahun: trenPublikasiPerTahun.data,
    trenSitasiPerDosen: trenSitasiPerDosen.data,
    top5DosenPublikasi: top5DosenPublikasi.data,
  };

  // Drilldown tingkat publikasi
  const [activeTingkatPublikasiData, setActiveTingkatPublikasiData] =
    useState(null);
  const [tingkatPublikasiBreadcrumbs, setTingkatPublikasiBreadcrumbs] =
    useState([{ label: 'Tingkat Publikasi', level: 0 }]);
  const [isTingkatPublikasiLoading, setIsTingkatPublikasiLoading] =
    useState(false);

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

  // Drilldown Data Handling for Publication Level
  const handleDrilldownTingkatPublikasi = useCallback(
    async (pieData: { id: string }) => {
      const level = pieData.id;

      if (tingkatPublikasiBreadcrumbs.length > 1) return;

      setIsTingkatPublikasiLoading(true);
      try {
        const baseUrl = `/api/public/karya-dosen-terdampak/drilldown-tingkat-publikasi?level=${level}`;
        const finalUrl = activeReportingYear
          ? `${baseUrl}&year=${activeReportingYear}`
          : baseUrl;
        const response = await fetch(finalUrl);

        if (!response.ok) throw new Error('Gagal fetch data detail');

        const result = await response.json();

        setActiveTingkatPublikasiData(result.data);
        setTingkatPublikasiBreadcrumbs((prev) => [
          ...prev,
          { label: `${level}`, level: 1 },
        ]);
      } catch (error) {
        console.error(error);
        setActiveTingkatPublikasiData(null);
      } finally {
        setIsTingkatPublikasiLoading(false);
      }
    },
    [activeReportingYear, tingkatPublikasiBreadcrumbs]
  );

  const handleTingkatPublikasiBreadcrumbClick = useCallback((level: number) => {
    if (level === 0) {
      setTingkatPublikasiBreadcrumbs((prev) => prev.slice(0, 1));
    }
  }, []);

  // Chart Component
  const chartChildren = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataStateMap: Record<DashboardId, DataState<any>> = {
      'distribusi-tingkat-publikasi': distribusiTingkatPublikasi,
      'tren-publikasi-per-tahun': trenPublikasiPerTahun,
      'tren-sitasi-per-dosen': trenSitasiPerDosen,
      'top5-dosen-publikasi': top5DosenPublikasi,
    };

    const dynamicDescription = `Data untuk tahun laporan ${activeReportingYear}`;

    // eslint-disable-next-line prefer-const
    let tempDashboardConfig = [...dashboardConfig];

    if (tingkatPublikasiBreadcrumbs.length > 1) {
      const tingkatPublikasiChartIndex = tempDashboardConfig.findIndex(
        (config) => config.id === 'distribusi-tingkat-publikasi'
      );

      if (tingkatPublikasiChartIndex !== -1) {
        tempDashboardConfig[tingkatPublikasiChartIndex] = {
          ...tempDashboardConfig[tingkatPublikasiChartIndex],
          title: `Proporsi Tingkat Publikasi`,
          component: MyBarChart,
          chartProps: {
            layout: 'vertical',
            dataKeys: ['value'],
            indexBy: 'label',
            axisBottomLegend: 'Tingkat',
            axisLeftLegend: 'Jumlah',
            breadcrumbs: tingkatPublikasiBreadcrumbs,
            onBreadcrumbClick: handleTingkatPublikasiBreadcrumbClick,
          },
        };
      }
    }

    if (tingkatPublikasiBreadcrumbs.length > 1) {
      dataStateMap['distribusi-tingkat-publikasi'] = {
        data: activeTingkatPublikasiData,
        isLoading: isTingkatPublikasiLoading,
        error: null,
      };
    }

    return tempDashboardConfig.map((config) => {
      const ChartComponent = config.component;
      const chartState = dataStateMap[config.id];
      // eslint-disable-next-line prefer-const
      let chartProps = { ...(config.chartProps ?? {}) };

      if (can('interact:charts')) {
        if (config.id === 'distribusi-tingkat-publikasi') {
          chartProps.onClick = handleDrilldownTingkatPublikasi;
        }
      }

      if (config.id === 'top5-dosen-publikasi' && activeReportingYear) {
        chartProps.dataKeys = [
          (activeReportingYear - 2).toString(),
          (activeReportingYear - 1).toString(),
          activeReportingYear.toString(),
        ];
      }

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
    distribusiTingkatPublikasi,
    trenPublikasiPerTahun,
    trenSitasiPerDosen,
    top5DosenPublikasi,
    activeReportingYear,
    tingkatPublikasiBreadcrumbs,
    handleTingkatPublikasiBreadcrumbClick,
    activeTingkatPublikasiData,
    isTingkatPublikasiLoading,
    can,
    pageKey,
    theme,
    showLabels,
    handleDrilldownTingkatPublikasi,
  ]);

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <PageHeader
            title="Karya Dosen Terdampak"
            description="IKU 5 Hasil kerja dosen digunakan oleh masyarakat atau mendapat rekognisi internasional."
            actions={
              <>
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
                    apiUrl="/api/public/filters/tahun-laporan-by-tipe?types=journal-conferences"
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
              </>
            }
          />
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
              <div className="-mx-4">
                <DashboardGridLayout pageKey={pageKey}>
                  {chartChildren}
                </DashboardGridLayout>
              </div>
              {!isPublicView && (
                <div className="flex w-full flex-col items-end gap-2 px-2 mt-3 sm:flex-row sm:items-start sm:justify-end-safe">
                  <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
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
                            <ImportDialog type="journal_conferences" />
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
