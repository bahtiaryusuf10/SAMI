'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { DashboardSettings } from '../settings/DashboardSettings';
import { PageHeader } from '@/components/layout/PageHeader';
import { QuickFilter } from '../settings/QuickFilter';
import { ShareButton } from '../ShareButton';
import { MySingleValueChart } from '../charts/MySingleValueChart';
import {
  AlertTriangle,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  Check,
  CheckCircle,
  GraduationCap,
  Handshake,
  Hourglass,
  Loader2,
  Target,
  X,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { MyDataTableMaster } from '../tables/MyDataTableMaster';
import Link from 'next/link';
import { MyBulletChart } from '../charts/MyBulletChart';
import { useMemo } from 'react';
import { DashboardGridLayout } from '../DashboardGridLayout';
import { MyLineChart } from '../charts/MyLineChart';
import { ExecutiveSummary } from '../ExecutiveSummary';
import { exportAsXlsx } from '@/lib/utils/handleExportFile';
import { toast } from 'sonner';
import { SortableHeader } from '@/components/tables/SortableHeader';

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface ChartDataBullet {
  id: string;
  ranges: number[];
  measures: number[];
  markers: number[];
}

interface ChartDataLine {
  id: string;
  data: {
    x: string | number;
    y: number;
  }[];
}

interface DataTable {
  kpi_group: string;
  kpi_key: string;
  description: string;
  target_value: number;
  target_unit: string;
  actual_value: number;
  status: string;
}

interface InfoAgregatRingkasan {
  achievement_percentage: number;
  total_measured_targets: number;
}

interface InfoAgregatTambahan {
  mbkm_percentage: number;
  work_percentage: number;
  cooperation_total: number;
  average_waiting_time: number;
  publication_ratio_dtps: number;
  s3_qualified_percentage: number;
}

interface DashboardData {
  infoAgregatRingkasan: DataState<InfoAgregatRingkasan>;
  infoAgregatTambahan: DataState<InfoAgregatTambahan>;
  detailCapaianKpi: DataState<DataTable[]>;
  distribusiCapaianKpi: DataState<ChartDataBullet>;
  trenSkorCapaianKpi: DataState<ChartDataLine>;
}

interface MainDashboardUIProps {
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
    id: 'distribusi-capaian-kpi',
    title: 'Perbandingan Capaian IKU',
    type: 'large',
    component: MyBulletChart,
  },
  {
    id: 'tren-skor-capaian-kpi',
    title: 'Tren Skor Capaian IKU',
    type: 'small',
    component: MyLineChart,
    chartProps: {
      axisLeftLegend: 'Persentase Capaian (%)',
      axisBottomLegend: 'Tahun',
    },
  },
] as const;

type DashboardId = (typeof dashboardConfig)[number]['id'];

const kpiRoutes: Record<string, string> = {
  'IKU 1': '/lulusan-bekerja',
  'IKU 2': '/pengalaman-mahasiswa',
  'IKU 3': '/aktivitas-dosen',
  'IKU 4': '/praktisi-mengajar',
  'IKU 5': '/karya-dosen-terdampak',
  'IKU 6': '/kerja-sama-global',
  'IKU 7': '/kelas-kolaboratif',
};

const kpiColumns: ColumnDef<DataTable>[] = [
  {
    accessorKey: 'kpi_group',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="KPI" />
      );
    },
    cell: ({ row }) => (
      <div className="text-center" title={row.getValue('kpi_group')}>
        {row.getValue('kpi_group')}
      </div>
    ),
    meta: {
      displayName: 'KPI',
    },
  },
  {
    accessorKey: 'kpi_key',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Metrik" />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center truncate" title={row.getValue('kpi_key')}>
          {row.getValue('kpi_key')}
        </div>
      );
    },
    meta: {
      displayName: 'Metrik',
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Deskripsi" />
      );
    },
    cell: ({ row }) => {
      const kpiGroup = row.original.kpi_group;
      const description = row.getValue('description') as string;

      const href = kpiRoutes[kpiGroup] || '#';

      return (
        <Link href={href} className="hover:underline">
          <div
            className="text-left whitespace-normal break-words line-clamp-2"
            title={description}
          >
            {description}
          </div>
        </Link>
      );
    },
    meta: {
      displayName: 'Deskripsi',
    },
  },
  {
    accessorKey: 'target_value',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Target" />
      );
    },
    cell: ({ row }) => {
      const value = row.getValue('target_value');
      const unit = row.original.target_unit;

      let formattedValue = String(value);

      switch (unit) {
        case 'Persen':
          formattedValue = `${value}%`;
          break;
        case 'Bulan':
          formattedValue = `${value} bulan`;
          break;
        default:
          break;
      }

      return <div className="text-center">{formattedValue}</div>;
    },
    meta: {
      displayName: 'Target',
    },
  },
  {
    accessorKey: 'actual_value',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Capaian" />
      );
    },
    cell: ({ row }) => {
      const raw = Number(row.getValue('actual_value') ?? 0);
      const value = parseFloat(raw.toFixed(1));
      const unit = row.original.target_unit;

      let formattedValue = String(value);

      switch (unit) {
        case 'Persen':
          formattedValue = `${value}%`;
          break;
        case 'Bulan':
          formattedValue = `${value} bulan`;
          break;
        default:
          break;
      }

      return <div className="text-center font-bold">{formattedValue}</div>;
    },
    meta: {
      displayName: 'Capaian',
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
        <div className="text-center">
          {row.getValue('status') === 'Tercapai' ? (
            <Check className="mx-auto text-green-500" size={18} />
          ) : (
            <X className="mx-auto text-red-500" size={18} />
          )}
        </div>
      );
    },
    meta: {
      displayName: 'Status',
    },
  },
];

export function MainDashboardUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: MainDashboardUIProps): JSX.Element {
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
    infoAgregatRingkasan,
    infoAgregatTambahan,
    detailCapaianKpi,
    distribusiCapaianKpi,
    trenSkorCapaianKpi,
  } = dashboardData;

  const summaryData = {
    infoAgregatRingkasan: infoAgregatRingkasan.data,
    infoAgregatTambahan: infoAgregatTambahan.data,
    detailCapaianKpi: detailCapaianKpi.data,
    distribusiCapaianKpi: distribusiCapaianKpi.data,
    trenSkorCapaianKpi: trenSkorCapaianKpi.data,
  };

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

  const handleExportTable = () => {
    if (detailCapaianKpi?.data && detailCapaianKpi.data.length > 0) {
      const fileName = `Ketercapaian Indikator Kinerja Utama (IKU)`;

      exportAsXlsx(detailCapaianKpi.data, fileName, kpiColumns);
    } else {
      toast.error('Tidak ada data untuk diekspor.');
    }
  };

  // Chart Component
  const chartChildren = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataStateMap: Record<DashboardId, DataState<any>> = {
      'distribusi-capaian-kpi': distribusiCapaianKpi,
      'tren-skor-capaian-kpi': trenSkorCapaianKpi,
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
    distribusiCapaianKpi,
    trenSkorCapaianKpi,
    activeReportingYear,
    pageKey,
    theme,
    showLabels,
  ]);

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <PageHeader
            title="Main Dashboard"
            description="Halaman ini menyediakan ringkasan mengenai kinerja dari setiap Indikator Kinerja Utama (IKU)."
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
                    apiUrl="/api/public/filters/tahun-laporan"
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
                {infoAgregatRingkasan.isLoading ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : infoAgregatRingkasan.error ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <p className="ml-2 text-red-400 text-md">
                      Gagal memuat data.
                    </p>
                  </div>
                ) : (
                  <>
                    {/*INFO STATISTIK KINERJA*/}
                    <MySingleValueChart
                      icon={<Target className="h-10 w-10 text-blue-400" />}
                      label="Total Metrik"
                      value={
                        infoAgregatRingkasan.data?.total_measured_targets ?? 0
                      }
                      targetLabel=""
                    />
                    <MySingleValueChart
                      icon={<CheckCircle className="h-10 w-10 text-blue-400" />}
                      label="Metrik Tercapai"
                      value={
                        infoAgregatRingkasan.data?.achievement_percentage
                          ? parseFloat(
                              infoAgregatRingkasan.data?.achievement_percentage.toFixed(
                                1
                              )
                            )
                          : 0
                      }
                      targetLabel="/ 100%"
                      targetValue={100}
                    />
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-5">
                {infoAgregatTambahan.isLoading ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : infoAgregatTambahan.error ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <p className="ml-2 text-red-400 text-md">
                      Gagal memuat data.
                    </p>
                  </div>
                ) : (
                  <>
                    <MySingleValueChart
                      icon={
                        <BriefcaseBusiness className="h-10 w-10 text-blue-400" />
                      }
                      label="Lulusan Bekerja"
                      value={
                        infoAgregatTambahan.data?.work_percentage
                          ? parseFloat(
                              infoAgregatTambahan.data?.work_percentage.toFixed(
                                1
                              )
                            )
                          : 0
                      }
                      targetValue={80}
                      targetLabel="/ 80%"
                    />
                    <MySingleValueChart
                      icon={<Hourglass className="h-10 w-10 text-blue-400" />}
                      label="Waktu Tunggu"
                      value={
                        infoAgregatTambahan.data?.average_waiting_time
                          ? parseFloat(
                              infoAgregatTambahan.data?.average_waiting_time.toFixed(
                                1
                              )
                            )
                          : 0
                      }
                      targetLabel="/ 3 Bulan"
                      targetValue={3}
                      direction="lower-is-better"
                    />
                    <MySingleValueChart
                      icon={<Briefcase className="h-10 w-10 text-blue-400" />}
                      label="MBKM 20 SKS"
                      value={
                        infoAgregatTambahan.data?.mbkm_percentage
                          ? parseFloat(
                              infoAgregatTambahan.data?.mbkm_percentage.toFixed(
                                1
                              )
                            )
                          : 0
                      }
                      targetLabel="/ 90%"
                      targetValue={90}
                    />
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-5">
                {infoAgregatTambahan.isLoading ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : infoAgregatTambahan.error ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <p className="ml-2 text-red-400 text-md">
                      Gagal memuat data.
                    </p>
                  </div>
                ) : (
                  <>
                    <MySingleValueChart
                      icon={
                        <GraduationCap className="h-10 w-10 text-blue-400" />
                      }
                      label="Dosen S3"
                      value={
                        infoAgregatTambahan.data?.s3_qualified_percentage ?? 0
                      }
                      targetLabel="/ 80%"
                      targetValue={80}
                    />
                    <MySingleValueChart
                      icon={<BookOpen className="h-10 w-10 text-blue-400" />}
                      label="Rasio Publikasi"
                      value={
                        infoAgregatTambahan.data?.publication_ratio_dtps ?? 0
                      }
                      targetLabel=""
                    />
                    <MySingleValueChart
                      icon={<Handshake className="h-10 w-10 text-blue-400" />}
                      label="Kerja Sama"
                      value={infoAgregatTambahan.data?.cooperation_total ?? 0}
                      targetLabel=""
                    />
                  </>
                )}
              </div>
              <div className="-mx-4">
                <DashboardGridLayout pageKey={pageKey}>
                  {chartChildren}
                </DashboardGridLayout>
              </div>
              <div className="mt-2">
                <MyDataTableMaster
                  columns={kpiColumns}
                  data={detailCapaianKpi.data || []}
                  searchPlaceholder="Cari IKU atau Deskripsi [ / ]"
                  isLoading={detailCapaianKpi.isLoading}
                  initialPageSize={8}
                  title="Ketercapaian Indikator Kinerja Utama (IKU)"
                  description={`Data untuk tahun laporan ${activeReportingYear}`}
                  onExport={handleExportTable}
                />
              </div>
              {!isPublicView && (
                <div className="flex w-full flex-col items-end gap-2 px-2 mt-3 sm:flex-row sm:items-start sm:justify-end-safe">
                  <ExecutiveSummary
                    pageKey={pageKey}
                    dataForSummary={summaryData}
                    activeReportingYear={activeReportingYear}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </DashboardProvider>
  );
}
