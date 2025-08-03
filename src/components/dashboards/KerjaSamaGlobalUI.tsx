'use client';

// import BubbleChat from '@/components/forms/BubbleChat';
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
  Factory,
  FileText,
  Handshake,
  Landmark,
  Loader2,
  Upload,
} from 'lucide-react';
import { MyLineChart } from '../charts/MyLineChart';
import { useCallback, useMemo, useState } from 'react';
import { DashboardGridLayout } from '../DashboardGridLayout';
import { MyPieChart } from '../charts/MyPieChart';
import { MyBarChart } from '../charts/MyBarChart';
import { Button } from '../ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { exportAsXlsx } from '@/lib/utils/handleExportFile';
import { DrilldownModal } from '../modals/DrilldownModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
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

interface DataTable {
  cooperation: string;
  partner_name: string;
  partner_type: number;
  partner_level: number;
  year: string;
}

interface DataImportLog {
  source_url: string;
  file_name: string;
  import_type: string;
}

interface InfoAgregatKerjaSama {
  jumlah_kerja_sama_internasional: number;
  jumlah_kerja_sama_instansi_pemerintah: number;
  jumlah_kerja_sama_bukan_instansi_pemerintah: number;
}

interface DashboardData {
  infoAgregatKerjaSama: DataState<InfoAgregatKerjaSama>;
  trenKerjaSamaPerTahun: DataState<ChartDataLine>;
  distribusiStatusKerjaSama: DataState<ChartDataPie>;
  distribusiTingkatKerjaSama: DataState<ChartDataPie>;
  distribusiJenisMitra: DataState<ChartDataBar>;
  importLog?: DataState<DataImportLog[]>;
}

interface KerjaSamaGlobalUIProps {
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
    id: 'tren-kerja-sama-per-tahun',
    title: 'Tren Kerja Sama',
    type: 'medium',
    component: MyLineChart,
    chartProps: {
      axisLeftLegend: 'Jumlah Kerja Sama',
      axisBottomLegend: 'Tahun',
    },
  },
  {
    id: 'distribusi-status-kerja-sama',
    title: 'Proporsi Status Kerja Sama',
    type: 'medium',
    isDrillDown: true,
    component: MyPieChart,
  },
  {
    id: 'distribusi-tingkat-kerja-sama',
    title: 'Proporsi Tingkat Kerja Sama',
    type: 'medium',
    component: MyPieChart,
  },
  {
    id: 'distribusi-jenis-mitra',
    title: 'Distribusi Jenis Mitra',
    type: 'medium',
    component: MyBarChart,
    chartProps: {
      dataKeys: ['value'],
      indexBy: 'label',
      axisBottomLegend: 'Jenis Mitra',
      axisLeftLegend: 'Jumlah Kerja Sama',
    },
  },
] as const;

type DashboardId = (typeof dashboardConfig)[number]['id'];

const cooperationColumns: ColumnDef<DataTable>[] = [
  {
    accessorKey: 'cooperation',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Bentuk
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-left whitespace-normal break-words line-clamp-3"
        title={row.getValue('cooperation')}
      >
        {row.getValue('cooperation')}
      </div>
    ),
    meta: {
      displayName: 'Bentuk',
    },
  },
  {
    accessorKey: 'partner_name',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Mitra
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center whitespace-normal break-words line-clamp-3">
          {row.getValue('partner_name')}
        </div>
      );
    },
    meta: {
      displayName: 'Mitra',
    },
  },
  {
    accessorKey: 'partner_type',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Jenis Mitra
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('partner_type')}</div>;
    },
    meta: {
      displayName: 'Jenis Mitra',
    },
  },
  {
    accessorKey: 'partner_level',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tingkat Mitra
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('partner_level')}</div>;
    },
    meta: {
      displayName: 'Tingkat Mitra',
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

export function KerjaSamaGlobalUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: KerjaSamaGlobalUIProps): JSX.Element {
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
    infoAgregatKerjaSama,
    trenKerjaSamaPerTahun,
    distribusiStatusKerjaSama,
    distribusiTingkatKerjaSama,
    distribusiJenisMitra,
    importLog,
  } = dashboardData;

  const summaryData = {
    infoAgregatKerjaSama: infoAgregatKerjaSama.data,
    trenKerjaSamaPerTahun: trenKerjaSamaPerTahun.data,
    distribusiStatusKerjaSama: distribusiStatusKerjaSama.data,
    distribusiTingkatKerjaSama: distribusiTingkatKerjaSama.data,
    distribusiJenisMitra: distribusiJenisMitra.data,
  };

  // Drilldown Cooperation Status
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [dataKerjaSama, setDataKerjaSama] = useState<DataTable[] | null>(null);
  const [isDrilldownKerjaSamaLoading, setIsDrilldownKerjaSamaLoading] =
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

  // Drilldown Data Handling for Cooperation Status
  const handleDrilldownKerjaSama = useCallback(
    async (pieData: { id: string; label: string }) => {
      const status = pieData.label;

      setSelectedStatus(status);
      setIsDrilldownKerjaSamaLoading(true);
      setDataKerjaSama(null);

      try {
        const baseUrl = `/api/public/kerja-sama-global/drilldown-status-kerja-sama?status=${encodeURIComponent(
          status
        )}`;

        const finalUrl = activeReportingYear
          ? `${baseUrl}&year=${activeReportingYear}`
          : baseUrl;

        const response = await fetch(finalUrl);

        if (!response.ok)
          throw new Error(`Gagal fetch data kerja sama untuk status ${status}`);

        const result = await response.json();
        console.log(result);
        setDataKerjaSama(result.data);
      } catch (error) {
        console.error(error);
        setDataKerjaSama([]);
      } finally {
        setIsDrilldownKerjaSamaLoading(false);
      }
    },
    [activeReportingYear]
  );

  // Export drilldown
  const handleExportDrilldownData = () => {
    if (dataKerjaSama && dataKerjaSama.length > 0 && selectedStatus) {
      const fileName = `Kerja Sama dengan Status ${selectedStatus}`;
      exportAsXlsx(dataKerjaSama, fileName, cooperationColumns);
    }
  };

  // Chart Component
  const chartChildren = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataStateMap: Record<DashboardId, DataState<any>> = {
      'tren-kerja-sama-per-tahun': trenKerjaSamaPerTahun,
      'distribusi-status-kerja-sama': distribusiStatusKerjaSama,
      'distribusi-tingkat-kerja-sama': distribusiTingkatKerjaSama,
      'distribusi-jenis-mitra': distribusiJenisMitra,
    };

    const dynamicDescription = `Data untuk tahun laporan ${activeReportingYear}`;

    return dashboardConfig.map((config) => {
      const ChartComponent = config.component;
      const chartState = dataStateMap[config.id];
      const chartProps = { ...(config.chartProps ?? {}) };

      if (can('interact:charts')) {
        if (config.id === 'distribusi-status-kerja-sama') {
          chartProps.onClick = handleDrilldownKerjaSama;
        }
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
    trenKerjaSamaPerTahun,
    distribusiStatusKerjaSama,
    distribusiTingkatKerjaSama,
    distribusiJenisMitra,
    activeReportingYear,
    can,
    pageKey,
    theme,
    showLabels,
    handleDrilldownKerjaSama,
  ]);

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <div className="flex w-full items-center justify-between px-2 pt-2 mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold text-white">
                Kerja Sama Global
              </h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  IKU 6 Program studi bekerjasama dengan mitra kelas dunia.
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
                  apiUrl="/api/public/filters/tahun-laporan-by-tipe?types=cooperations"
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
                {infoAgregatKerjaSama.isLoading ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : infoAgregatKerjaSama.error ? (
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
                      icon={<Handshake className="h-10 w-10 text-blue-400" />}
                      label="Internasional"
                      value={
                        infoAgregatKerjaSama.data
                          ?.jumlah_kerja_sama_internasional ?? 0
                      }
                      targetLabel="/ 2"
                      targetValue={2}
                    />
                    <MySingleValueChart
                      icon={<Landmark className="h-10 w-10 text-blue-400" />}
                      label="Instansi Pemerintah"
                      value={
                        infoAgregatKerjaSama.data
                          ?.jumlah_kerja_sama_instansi_pemerintah ?? 0
                      }
                      targetLabel="/ 3"
                      targetValue={3}
                    />
                    <MySingleValueChart
                      icon={<Factory className="h-10 w-10 text-blue-400" />}
                      label="Dunia Usaha/Industri"
                      value={
                        infoAgregatKerjaSama.data
                          ?.jumlah_kerja_sama_bukan_instansi_pemerintah ?? 0
                      }
                      targetLabel="/ 3"
                      targetValue={3}
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
                isOpen={dataKerjaSama !== null}
                onClose={() => {
                  setDataKerjaSama(null);
                  setSelectedStatus(null);
                }}
                title={`Daftar Kerja Sama`}
                description={`Berikut adalah daftar kerja sama dengan status ${selectedStatus}.`}
                columns={cooperationColumns}
                data={dataKerjaSama}
                isLoading={isDrilldownKerjaSamaLoading}
                onExport={handleExportDrilldownData}
                initialPageSize={8}
                searchPlaceholder="Cari berdasarkan Bentuk Kerja Sama atau Mitra [ / ]"
              />
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
                            <ImportDialog type="cooperations" />
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
        {/* {!isPublicView && <BubbleChat />} */}
      </>
    </DashboardProvider>
  );
}
