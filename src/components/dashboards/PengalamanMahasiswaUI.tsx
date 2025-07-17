'use client';

import BubbleChat from '@/components/forms/BubbleChat';
import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { DashboardSettings } from '../settings/DashboardSettings';
import { QuickFilter } from '../settings/QuickFilter';
import { ShareButton } from '../ShareButton';
import { MySingleValueChart } from '../charts/MySingleValueChart';
import {
  AlertTriangle,
  ArrowUpDown,
  BadgeCheck,
  Briefcase,
  Loader2,
  User,
} from 'lucide-react';
import { MyBarChart } from '../charts/MyBarChart';
import { useCallback, useMemo, useState } from 'react';
import { DashboardGridLayout } from '../DashboardGridLayout';
import { MyPieChart } from '../charts/MyPieChart';
import { MyScatterPlot } from '../charts/MyScatterPlot';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { exportAsXlsx } from '@/lib/utils/handleExportFile';
import { DrilldownModal } from '../Modal/DrilldownModal';

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

interface ScatterPoint {
  x: number;
  y: number;
}

interface ChartDataScatterSeries {
  id: string;
  data: ScatterPoint[];
}

interface DataTable {
  name: string;
  achievement: string;
  year: number;
}

interface InfoAgregatMahasiswa {
  jumlah_mahasiswa_aktif: number;
  persentase_mbkm_mahasiswa: number;
  persentase_sertifikasi_internasional: number;
}

interface DashboardData {
  infoAgregatMahasiswa: DataState<InfoAgregatMahasiswa>;
  prestasiMahasiswa: DataState<ChartDataBar>;
  top5MitraMbkm: DataState<ChartDataBar>;
  distribusiMbkm: DataState<ChartDataPie>;
  korelasiPrestasiDanIpk: DataState<ChartDataScatterSeries>;
}

interface PengalamanMahasiswaUIProps {
  pageKey: string;
  dashboardData: DashboardData;
  isPublicView?: boolean;
  initialActiveYear?: number | null;
}

interface DashboardConfigItem {
  id: string;
  title: string;
  type: 'small' | 'semiMedium' | 'medium' | 'semiLarge' | 'large';
  isPercentage?: boolean;
  isDrillDown?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartProps?: Record<string, any>;
}

const dashboardConfig: DashboardConfigItem[] = [
  {
    id: 'prestasi-mahasiswa',
    title: 'Prestasi Mahasiswa',
    type: 'medium',
    isDrillDown: true,
    component: MyBarChart,
    chartProps: {
      dataKeys: ['Akademik', 'Non-Akademik'],
      indexBy: 'level',
      axisBottomLegend: 'Tingkat',
      axisLeftLegend: 'Persentase (%)',
    },
  },
  {
    id: 'korelasi-prestasi-dan-ipk',
    title: 'Sebaran Prestasi dan IPK ',
    type: 'medium',
    component: MyScatterPlot,
    chartProps: {
      axisBottomLegend: 'IPK',
      axisLeftLegend: 'Jumlah Prestasi',
    },
  },
  {
    id: 'top5-mitra-mbkm',
    title: 'Top 5 Mitra MBKM',
    type: 'medium',
    component: MyBarChart,
    chartProps: {
      dataKeys: ['value'],
      indexBy: 'label',
      axisBottomLegend: 'Mitra',
      axisLeftLegend: 'Jumlah',
    },
  },
  {
    id: 'distribusi-mbkm',
    title: 'Distribusi Kategori MBKM',
    type: 'medium',
    isPercentage: true,
    component: MyPieChart,
  },
] as const;

type DashboardId = (typeof dashboardConfig)[number]['id'];

const achievementColumns: ColumnDef<DataTable>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div className="text-left w-[250px]">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nama Kompetisi
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-left w-[250px] truncate"
        title={row.getValue('name')}
      >
        {row.getValue('name')}
      </div>
    ),
    meta: {
      displayName: 'Nama Kompetisi',
    },
  },
  {
    accessorKey: 'achievement',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Pencapaian
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('achievement')}</div>;
    },
    meta: {
      displayName: 'Pencapaian',
    },
  },
  {
    accessorKey: 'year',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tahun
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('year')}</div>;
    },
    meta: {
      displayName: 'Tahun',
    },
  },
];

export function PengalamanMahasiswaUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: PengalamanMahasiswaUIProps): JSX.Element {
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
    infoAgregatMahasiswa,
    prestasiMahasiswa,
    top5MitraMbkm,
    distribusiMbkm,
    korelasiPrestasiDanIpk,
  } = dashboardData;

  // Drilldown Prestasi
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [dataPrestasi, setDataPrestasi] = useState<DataTable[] | null>(null);
  const [isDrilldownPrestasiLoading, setIsDrilldownPrestasiLoading] =
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

  // Drilldown Data Handling for Achievement
  const handleDrilldownPrestasi = useCallback(
    async (barData: { indexValue: string; id: string }) => {
      const level = barData.indexValue;
      const kategori = barData.id;

      setSelectedKategori(kategori);
      setSelectedLevel(level);
      setIsDrilldownPrestasiLoading(true);
      setDataPrestasi(null);

      try {
        const baseUrl = `/api/public/pengalaman-mahasiswa/drilldown-detail-prestasi?level=${encodeURIComponent(
          level
        )}&category=${encodeURIComponent(kategori)}`;

        const finalUrl = activeReportingYear
          ? `${baseUrl}&year=${activeReportingYear}`
          : baseUrl;

        const response = await fetch(finalUrl);

        if (!response.ok)
          throw new Error(
            `Gagal fetch data prestasi untuk ${kategori} ${level}`
          );

        const result = await response.json();
        setDataPrestasi(result.data);
      } catch (error) {
        console.error(error);
        setDataPrestasi([]);
      } finally {
        setIsDrilldownPrestasiLoading(false);
      }
    },
    [activeReportingYear]
  );

  // Export drilldown
  const handleExportDrilldownData = () => {
    if (
      dataPrestasi &&
      dataPrestasi.length > 0 &&
      selectedKategori &&
      selectedLevel
    ) {
      const fileName = `Prestasi kategori ${selectedKategori} dan tingkat ${selectedLevel}`;
      exportAsXlsx(dataPrestasi, fileName);
    }
  };

  // Chart Component
  const chartChildren = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataStateMap: Record<DashboardId, DataState<any>> = {
      'prestasi-mahasiswa': prestasiMahasiswa,
      'top5-mitra-mbkm': top5MitraMbkm,
      'distribusi-mbkm': distribusiMbkm,
      'korelasi-prestasi-dan-ipk': korelasiPrestasiDanIpk,
    };

    const dynamicDescription = `Data untuk tahun laporan ${activeReportingYear}`;

    return dashboardConfig.map((config) => {
      const ChartComponent = config.component;
      const chartState = dataStateMap[config.id];
      const chartProps = { ...(config.chartProps ?? {}) };

      if (config.id === 'prestasi-mahasiswa') {
        chartProps.onClick = handleDrilldownPrestasi;
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
    prestasiMahasiswa,
    top5MitraMbkm,
    distribusiMbkm,
    korelasiPrestasiDanIpk,
    activeReportingYear,
    pageKey,
    theme,
    showLabels,
    handleDrilldownPrestasi,
  ]);

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <div className="flex w-full items-center justify-between px-2 pt-2 mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold text-white">
                Pengalaman Mahasiswa
              </h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  IKU 2 Mahasiswa mendapat pengalaman di luar kampus.
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
                {infoAgregatMahasiswa.isLoading ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : infoAgregatMahasiswa.error ? (
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
                      icon={<User className="h-10 w-10 text-blue-400" />}
                      label="Mahasiswa Aktif"
                      value={
                        infoAgregatMahasiswa.data?.jumlah_mahasiswa_aktif ?? 0
                      }
                      targetLabel=""
                    />
                    <MySingleValueChart
                      icon={<Briefcase className="h-10 w-10 text-blue-400" />}
                      label="MBKM 20 SKS"
                      value={parseFloat(
                        (
                          infoAgregatMahasiswa.data
                            ?.persentase_mbkm_mahasiswa ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 90%"
                      targetValue={90}
                    />
                    <MySingleValueChart
                      icon={<BadgeCheck className="h-10 w-10 text-blue-400" />}
                      label="Sertifikat Internasional"
                      value={parseFloat(
                        (
                          infoAgregatMahasiswa.data
                            ?.persentase_sertifikasi_internasional ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 5%"
                      targetValue={5}
                    />
                  </>
                )}
              </div>
              <div className="-mx-4">
                <DashboardGridLayout pageKey={pageKey}>
                  {chartChildren}
                </DashboardGridLayout>
              </div>
              <DrilldownModal
                isOpen={dataPrestasi !== null}
                onClose={() => {
                  setDataPrestasi(null);
                  setSelectedKategori(null);
                  setSelectedLevel(null);
                }}
                title={` Prestasi kategori ${selectedKategori} di tingkat ${' '}
                          ${selectedLevel}`}
                description={`Berikut adalah daftar prestasi untuk kategori ${selectedKategori} di tingkat ${selectedLevel}.`}
                columns={achievementColumns}
                data={dataPrestasi}
                isLoading={isDrilldownPrestasiLoading}
                onExport={handleExportDrilldownData}
                initialPageSize={8}
                searchPlaceholder="Cari berdasarkan Nama atau Pencapaian [ / ]"
              />
              {!isPublicView && (
                <div className="flex flex-wrap gap-4">
                  <ImportDialog type="mbkms" />
                  {/* <ImportDialog type="students" /> */}
                  <ImportDialog type="achievements" />
                  <ImportDialog type="certificates" />
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
