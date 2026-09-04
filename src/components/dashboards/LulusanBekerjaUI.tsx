'use client';

import { useMemo, useState, useCallback, JSX } from 'react';
import { MyBarChart } from '@/components/charts/MyBarChart';
import { MyPieChart } from '@/components/charts/MyPieChart';
import { MySingleValueChart } from '@/components/charts/MySingleValueChart';
import { DashboardGridLayout } from '@/components/DashboardGridLayout';
import ImportDialog from '@/components/ImportDialog';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Loader2,
  AlertTriangle,
  Wallet,
  Hourglass,
  FileText,
  Upload,
} from 'lucide-react';
import { DashboardSettings } from '@/components/settings/DashboardSettings';
import { PageHeader } from '@/components/layout/PageHeader';
import { ShareButton } from '@/components/ShareButton';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { exportAsXlsx } from '@/lib/utils/handleExportFile';
import { QuickFilter } from '@/components/settings/QuickFilter';
import { ColumnDef } from '@tanstack/react-table';
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
import { SortableHeader } from '@/components/tables/SortableHeader';

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface ChartDataPie {
  id: string;
  label: string;
  value: number;
}

interface ChartDataBar {
  label: string;
  value: number;
}

interface DataTable {
  label: string;
  value: number;
}

interface DataImportLog {
  source_url: string;
  file_name: string;
  import_type: string;
}

interface InfoAgregatLulusan {
  jumlah_mahasiswa: number;
  rata_rata_rasio_penghasilan_terhadap_ump: number;
  rata_rata_waktu_tunggu: number;
}

interface DashboardData {
  infoAgregatLulusan: DataState<InfoAgregatLulusan>;
  lokasiBekerja: DataState<ChartDataBar>;
  statusLulusan: DataState<ChartDataPie>;
  waktuTungguBekerja: DataState<ChartDataPie>;
  rentangPenghasilan: DataState<ChartDataBar>;
  importLog?: DataState<DataImportLog[]>;
}

interface LulusanBekerjaUIProps {
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

const graduateStatusTargets = {
  Bekerja: 80,
  'Studi Lanjut': 10,
  Berwiraswasta: 10,
};

const dashboardConfig: DashboardConfigItem[] = [
  {
    id: 'lokasi-bekerja',
    title: 'Lokasi Bekerja',
    type: 'semiLarge',
    isDrillDown: true,
    component: MyBarChart,
    chartProps: {
      dataKeys: ['value'],
      indexBy: 'label',
      axisBottomLegend: 'Lokasi',
      axisLeftLegend: 'Jumlah Lulusan',
    },
  },
  {
    id: 'status-lulusan',
    title: 'Status Lulusan',
    type: 'semiMedium',
    isPercentage: true,
    component: MyPieChart,
    chartProps: {
      targets: graduateStatusTargets,
    },
  },
  {
    id: 'rentang-penghasilan',
    title: 'Rentang Penghasilan',
    type: 'medium',
    isDrillDown: true,
    component: MyBarChart,
    chartProps: {
      layout: 'horizontal',
      dataKeys: ['value'],
      indexBy: 'label',
      axisBottomLegend: 'Rentang Penghasilan',
      axisLeftLegend: 'Jumlah Lulusan',
    },
  },
  {
    id: 'waktu-tunggu-bekerja',
    title: 'Waktu Tunggu Bekerja',
    type: 'medium',
    component: MyPieChart,
  },
] as const;

type DashboardId = (typeof dashboardConfig)[number]['id'];

const workplaceColumns: ColumnDef<DataTable>[] = [
  {
    accessorKey: 'label',
    size: 400,
    minSize: 200,
    maxSize: 600,
    header: ({ column }) => {
      return <SortableHeader column={column} label="Nama Perusahaan" />;
    },
    cell: ({ row }) => (
      <div className="text-left w-full truncate">
        {row.getValue('label')}
      </div>
    ),
    meta: {
      displayName: 'Nama Perusahaan',
    },
  },
  {
    accessorKey: 'value',
    size: 170,
    minSize: 120,
    maxSize: 300,
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Jumlah Lulusan" />
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('value')}</div>
    ),
    meta: {
      displayName: 'Jumlah Lulusan',
    },
  },
];

export function LulusanBekerjaUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: LulusanBekerjaUIProps): JSX.Element {
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
    infoAgregatLulusan,
    lokasiBekerja,
    statusLulusan,
    waktuTungguBekerja,
    rentangPenghasilan,
    importLog,
  } = dashboardData;

  const summaryData = {
    infoAgregatLulusan: infoAgregatLulusan.data,
    lokasiBekerja: lokasiBekerja.data,
    statusLulusan: statusLulusan.data,
    waktuTungguBekerja: waktuTungguBekerja.data,
    rentangPenghasilan: rentangPenghasilan.data,
  };

  // Drilldown lokasi bekerja
  const [selectedLokasiBekerja, setSelectedLokasiBekerja] = useState<
    string | null
  >(null);
  const [dataTempatBekerja, setDataTempatBekerja] = useState<
    ChartDataBar[] | null
  >(null);
  const [isDrilldownTempatBekerjaLoading, setIsDrilldownTempatBekerjaLoading] =
    useState(false);

  // Drilldown penghasilan
  const [activePenghasilanData, setActivePenghasilanData] = useState(null);
  const [penghasilanBreadcrumbs, setPenghasilanBreadcrumbs] = useState([
    { label: 'Rentang Penghasilan', level: 0 },
  ]);
  const [isPenghasilanLoading, setIsPenghasilanLoading] = useState(false);

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

  // Drilldown Data Handling for Location
  const handleDrilldownLokasi = useCallback(
    async (barData: { indexValue: string }) => {
      const lokasiBekerja = barData.indexValue;

      console.log(`Drill down untuk lokasi bekerja : ${lokasiBekerja}`);

      setSelectedLokasiBekerja(lokasiBekerja);
      setIsDrilldownTempatBekerjaLoading(true);
      setDataTempatBekerja(null);

      try {
        const baseUrl = `/api/public/lulusan-bekerja/drilldown-lokasi-bekerja?province=${encodeURIComponent(
          lokasiBekerja
        )}`;

        const finalUrl = activeReportingYear
          ? `${baseUrl}&year=${activeReportingYear}`
          : baseUrl;

        const response = await fetch(finalUrl);

        if (!response.ok)
          throw new Error(
            `Gagal fetch data tempat kerja untuk ${lokasiBekerja}`
          );

        const result = await response.json();
        setDataTempatBekerja(result.data);
      } catch (error) {
        console.error(error);
        setDataTempatBekerja([]);
      } finally {
        setIsDrilldownTempatBekerjaLoading(false);
      }
    },
    [activeReportingYear]
  );

  // Drilldown Data Handling for Income
  const handleDrilldownPenghasilan = useCallback(
    async (barData: { indexValue: string; id: string }) => {
      const kategoriPenghasilan = barData.indexValue;

      if (penghasilanBreadcrumbs.length > 1) return;

      setIsPenghasilanLoading(true);

      try {
        const baseUrl = `/api/public/lulusan-bekerja/drilldown-penghasilan?category=${encodeURIComponent(
          kategoriPenghasilan
        )}`;
        const finalUrl = activeReportingYear
          ? `${baseUrl}&year=${activeReportingYear}`
          : baseUrl;
        const response = await fetch(finalUrl);

        if (!response.ok) throw new Error('Gagal fetch data detail');

        const result = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedData = result.data.map((item: any) => {
          const formattedLabel = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(Number(item.label));

          return {
            ...item,
            id: formattedLabel,
            label: formattedLabel,
          };
        });

        setActivePenghasilanData(formattedData);
        setPenghasilanBreadcrumbs((prev) => [
          ...prev,
          { label: kategoriPenghasilan, level: 1 },
        ]);
      } catch (error) {
        console.error(error);
        setActivePenghasilanData(null);
      } finally {
        setIsPenghasilanLoading(false);
      }
    },
    [activeReportingYear, penghasilanBreadcrumbs]
  );

  const handlePenghasilanBreadcrumbClick = useCallback((level: number) => {
    if (level === 0) {
      setPenghasilanBreadcrumbs((prev) => prev.slice(0, 1));
    }
  }, []);

  // Export drilldown
  const handleExportDrilldownData = () => {
    if (
      dataTempatBekerja &&
      dataTempatBekerja.length > 0 &&
      selectedLokasiBekerja
    ) {
      const fileName = `Tempat Kerja Lulusan di ${selectedLokasiBekerja}`;
      exportAsXlsx(dataTempatBekerja, fileName, workplaceColumns);
    }
  };

  // Chart Component
  const chartChildren = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataStateMap: Record<DashboardId, DataState<any>> = {
      'lokasi-bekerja': lokasiBekerja,
      'status-lulusan': statusLulusan,
      'rentang-penghasilan': rentangPenghasilan,
      'waktu-tunggu-bekerja': waktuTungguBekerja,
    };

    const dynamicDescription = activeReportingYear
      ? `Data untuk laporan tahun ${activeReportingYear}`
      : 'Data untuk semua tahun kelulusan';

    // eslint-disable-next-line prefer-const
    let tempDashboardConfig = [...dashboardConfig];

    if (penghasilanBreadcrumbs.length > 1) {
      const penghasilanChartIndex = tempDashboardConfig.findIndex(
        (config) => config.id === 'rentang-penghasilan'
      );

      if (penghasilanChartIndex !== -1) {
        tempDashboardConfig[penghasilanChartIndex] = {
          ...tempDashboardConfig[penghasilanChartIndex],
          title: `Rentang Penghasilan`,
          component: MyPieChart,
          chartProps: {
            breadcrumbs: penghasilanBreadcrumbs,
            onBreadcrumbClick: handlePenghasilanBreadcrumbClick,
          },
        };
      }
    }

    if (penghasilanBreadcrumbs.length > 1) {
      dataStateMap['rentang-penghasilan'] = {
        data: activePenghasilanData,
        isLoading: isPenghasilanLoading,
        error: null,
      };
    }

    return tempDashboardConfig.map((config) => {
      const ChartComponent = config.component;
      const chartState = dataStateMap[config.id];
      const chartProps = { ...(config.chartProps ?? {}) };

      if (can('interact:charts')) {
        switch (config.id) {
          case 'lokasi-bekerja':
            chartProps.onClick = handleDrilldownLokasi;
            break;
          case 'rentang-penghasilan':
            chartProps.onClick = handleDrilldownPenghasilan;
            break;
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
    lokasiBekerja,
    statusLulusan,
    rentangPenghasilan,
    waktuTungguBekerja,
    activeReportingYear,
    penghasilanBreadcrumbs,
    handlePenghasilanBreadcrumbClick,
    activePenghasilanData,
    isPenghasilanLoading,
    can,
    pageKey,
    theme,
    showLabels,
    handleDrilldownLokasi,
    handleDrilldownPenghasilan,
  ]);

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <PageHeader
            title="Lulusan Bekerja"
            description="IKU 1 Lulusan mendapatkan pekerjaan yang layak."
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
                    apiUrl="/api/public/filters/tahun-laporan-by-tipe?types=tracer-studies,graduates"
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
                {infoAgregatLulusan.isLoading ? (
                  <div className="flex justify-center items-center w-full h-[50px] rounded-xl bg-white">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : infoAgregatLulusan.error ? (
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
                      icon={
                        <GraduationCap className="h-10 w-10 text-blue-400" />
                      }
                      label="Lulusan"
                      value={infoAgregatLulusan.data?.jumlah_mahasiswa ?? 0}
                      targetLabel=""
                    />
                    <MySingleValueChart
                      icon={<Wallet className="h-10 w-10 text-blue-400" />}
                      label="Rasio Penghasilan"
                      value={parseFloat(
                        (
                          infoAgregatLulusan.data
                            ?.rata_rata_rasio_penghasilan_terhadap_ump ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 1.2 x UMP"
                      targetValue={1.2}
                    />
                    <MySingleValueChart
                      icon={<Hourglass className="h-10 w-10 text-blue-400" />}
                      label="Waktu Tunggu"
                      value={parseFloat(
                        (
                          infoAgregatLulusan.data?.rata_rata_waktu_tunggu ?? 0
                        ).toFixed(1)
                      )}
                      targetLabel="/ 3 bulan"
                      targetValue={3}
                      direction="lower-is-better"
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
                isOpen={dataTempatBekerja !== null}
                onClose={() => {
                  setDataTempatBekerja(null);
                  setSelectedLokasiBekerja(null);
                }}
                title={`Tempat Bekerja di ${selectedLokasiBekerja}`}
                description={`Berikut adalah daftar tempat kerja untuk ${selectedLokasiBekerja}.`}
                columns={workplaceColumns}
                data={dataTempatBekerja}
                isLoading={isDrilldownTempatBekerjaLoading}
                onExport={handleExportDrilldownData}
                initialPageSize={8}
                searchPlaceholder="Cari Nama Perusahaan [ / ]"
              />
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
                            <ImportDialog type="graduates" />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="p-0 my-2 mx-1"
                          >
                            <ImportDialog type="tracer_studies" />
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
