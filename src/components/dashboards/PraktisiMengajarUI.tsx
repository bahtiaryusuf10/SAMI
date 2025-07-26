'use client';

// import BubbleChat from '@/components/forms/BubbleChat';
import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { QuickFilter } from '../settings/QuickFilter';
import { DashboardSettings } from '../settings/DashboardSettings';
import { ShareButton } from '../ShareButton';
import { MySingleValueChart } from '../charts/MySingleValueChart';
import {
  AlertTriangle,
  ArrowUpDown,
  BadgeCheck,
  FileText,
  GraduationCap,
  Loader2,
  Rocket,
  Upload,
  User,
} from 'lucide-react';
import { MyPieChart } from '../charts/MyPieChart';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DashboardGridLayout } from '../DashboardGridLayout';
import { MyBarChart } from '../charts/MyBarChart';
import { exportAsXlsx } from '@/lib/utils/handleExportFile';
import { DrilldownModal } from '../modal/DrilldownModal';
import { Button } from '../ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { normalizeTitleCase } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useUser } from '@/contexts/UserContext';

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
  practitioner_name: string;
  profession: string;
  workplace: string;
  teaching_date: string;
}

interface DataImportLog {
  source_url: string;
  file_name: string;
  import_type: string;
}

interface InfoAgregatPraktisi {
  persentase_praktisi_mengajar: number;
  persentase_dosen_berkualifikasi_s3: number;
  persentase_dosen_bersertifikat_profesi: number;
  persentase_dosen_menjadi_praktisi: number;
}

interface DashboardData {
  infoAgregatPraktisi: DataState<InfoAgregatPraktisi>;
  distribusiJabatanDosen: DataState<ChartDataPie>;
  top5MataKuliah: DataState<ChartDataBar>;
  distribusiPerusahaan: DataState<ChartDataPie>;
  sertifikasiProfesi: DataState<ChartDataBar>;
  importLog?: DataState<DataImportLog[]>;
}

interface PraktisiMengajarUIProps {
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
    id: 'top5-mata-kuliah',
    title: 'Top 5 Mata Kuliah (Praktisi)',
    type: 'medium',
    component: MyBarChart,
    isDrillDown: true,
    chartProps: {
      layout: 'vertical',
      dataKeys: ['value'],
      indexBy: 'label',
      axisBottomLegend: 'Mata Kuliah',
      axisLeftLegend: 'Jumlah Pembelajaran',
    },
  },
  {
    id: 'distribusi-perusahaan-praktisi-mengajar',
    title: 'Perusahaan Praktisi Pengajar',
    type: 'medium',
    component: MyPieChart,
  },
  {
    id: 'distribusi-jabatan-dosen',
    title: 'Jabatan Akademik Dosen Tetap',
    type: 'medium',
    component: MyPieChart,
    isDrillDown: true,
  },
  {
    id: 'sertifikasi-profesi',
    title: 'Sertifikasi Profesi Dosen Tetap',
    type: 'medium',
    component: MyBarChart,
    chartProps: {
      grouped: 'stacked',
      dataKeys: ['Bersertifikasi', 'Tidak Bersertifikasi'],
      indexBy: 'academic_rank',
      axisBottomLegend: 'Jabatan Akademik',
      axisLeftLegend: 'Jumlah Dosen',
    },
  },
] as const;

type DashboardId = (typeof dashboardConfig)[number]['id'];

const practitionerColumns: ColumnDef<DataTable>[] = [
  {
    accessorKey: 'practitioner_name',
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nama Praktisi
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-left truncate">
        {row.getValue('practitioner_name')}
      </div>
    ),
    meta: {
      displayName: 'Nama Praktisi',
    },
  },
  {
    accessorKey: 'profession',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Profesi
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('profession')}</div>
    ),
    meta: {
      displayName: 'Profesi',
    },
  },
  {
    accessorKey: 'workplace',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Perusahaan
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('workplace')}</div>
    ),
    meta: {
      displayName: 'Perusahaan',
    },
  },
  {
    accessorKey: 'teaching_date',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Waktu Mengajar
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('teaching_date')}</div>
    ),
    meta: {
      displayName: 'Waktu Mengajar',
    },
  },
];

export function PraktisiMengajarUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: PraktisiMengajarUIProps): JSX.Element {
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
    infoAgregatPraktisi,
    distribusiJabatanDosen,
    top5MataKuliah,
    distribusiPerusahaan,
    sertifikasiProfesi,
    importLog,
  } = dashboardData;

  // Drilldown mata kuliah oleh praktisi
  const [selectedMataKuliah, setSelectedMataKuliah] = useState<string | null>(
    null
  );
  const [dataPraktisi, setDataPraktisi] = useState<DataTable[] | null>(null);
  const [isDrilldownPraktisiLoading, setIsDrilldownPraktisiLoading] =
    useState(false);

  // Drilldown jabatan akadmeik
  const [activeJabatanAkademikData, setActiveJabatanAkademikData] = useState(
    distribusiJabatanDosen.data || []
  );
  const [jabatanAkademikBreadcrumbs, setJabatanAkademikBreadcrumbs] = useState([
    { label: 'Jabatan Akademik', level: 0 },
  ]);
  const [isJabatanAkademikLoading, setIsJabatanAkademikLoading] =
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

  // Drilldown Data Handling for Course
  const handleDrilldownMataKuliah = useCallback(
    async (barData: { data: { course_key: string }; indexValue: string }) => {
      const kodeMataKuliah = barData.data.course_key;
      const mataKuliah = normalizeTitleCase(barData.indexValue);

      console.log(`Drill down mata kuliah : ${mataKuliah}`);

      setSelectedMataKuliah(mataKuliah);
      setIsDrilldownPraktisiLoading(true);
      setDataPraktisi(null);

      try {
        const baseUrl = `/api/public/praktisi-mengajar/drilldown-top5-mata-kuliah?courseKey=${encodeURIComponent(
          kodeMataKuliah
        )}`;

        const finalUrl = activeReportingYear
          ? `${baseUrl}&year=${activeReportingYear}`
          : baseUrl;

        const response = await fetch(finalUrl);

        if (!response.ok)
          throw new Error(`Gagal fetch data praktisi untuk ${mataKuliah}`);

        const result = await response.json();
        setDataPraktisi(result.data);
      } catch (error) {
        console.error(error);
        setDataPraktisi([]);
      } finally {
        setIsDrilldownPraktisiLoading(false);
      }
    },
    [activeReportingYear]
  );

  // Drilldown Data Handling for Academic Rank
  useEffect(() => {
    if (jabatanAkademikBreadcrumbs.length === 1) {
      setActiveJabatanAkademikData(distribusiJabatanDosen.data || []);
    }
  }, [distribusiJabatanDosen.data, jabatanAkademikBreadcrumbs]);

  // Drilldown Data Handling for Academic Rank
  const handleDrilldownJabatanAkademik = useCallback(
    async (pieData: { id: string; label: string }) => {
      if (jabatanAkademikBreadcrumbs.length > 1) return;

      const rank = pieData.label;
      setIsJabatanAkademikLoading(true);

      try {
        const baseUrl = `/api/public/praktisi-mengajar/drilldown-jabatan-akademik?rank=${rank}`;
        const finalUrl = activeReportingYear
          ? `${baseUrl}&year=${activeReportingYear}`
          : baseUrl;
        const response = await fetch(finalUrl);

        if (!response.ok) throw new Error('Gagal fetch data detail');

        const result = await response.json();

        setActiveJabatanAkademikData(result.data);
        setJabatanAkademikBreadcrumbs((prev) => [
          ...prev,
          { label: `${rank}`, level: 1 },
        ]);
      } catch (error) {
        console.error(error);
        setActiveJabatanAkademikData([]);
      } finally {
        setIsJabatanAkademikLoading(false);
      }
    },
    [activeReportingYear, jabatanAkademikBreadcrumbs]
  );

  const handleJabatanAkademikBreadcrumbClick = useCallback(
    (level: number) => {
      if (level === 0) {
        setActiveJabatanAkademikData(distribusiJabatanDosen.data || []);
        setJabatanAkademikBreadcrumbs((prev) => prev.slice(0, 1));
      }
    },
    [distribusiJabatanDosen.data]
  );

  // Export drilldown
  const handleExportDrilldownData = () => {
    if (dataPraktisi && dataPraktisi.length > 0 && selectedMataKuliah) {
      const fileName = `Praktisi mengajar mata kuliah ${selectedMataKuliah}`;
      exportAsXlsx(dataPraktisi, fileName, practitionerColumns);
    }
  };

  // Chart Component
  const chartChildren = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataStateMap: Record<DashboardId, DataState<any>> = {
      'distribusi-jabatan-dosen': distribusiJabatanDosen,
      'top5-mata-kuliah': top5MataKuliah,
      'distribusi-perusahaan-praktisi-mengajar': distribusiPerusahaan,
      'sertifikasi-profesi': sertifikasiProfesi,
    };

    if (jabatanAkademikBreadcrumbs.length > 1) {
      dataStateMap['distribusi-jabatan-dosen'] = {
        data: activeJabatanAkademikData,
        isLoading: isJabatanAkademikLoading,
        error: null,
      };
    }

    const dynamicDescription = `Data untuk tahun laporan ${activeReportingYear}`;

    return dashboardConfig.map((config) => {
      const ChartComponent = config.component;
      const chartState = dataStateMap[config.id];
      const chartProps = { ...(config.chartProps ?? {}) };

      if (can('interact:charts')) {
        switch (config.id) {
          case 'distribusi-jabatan-dosen':
            chartProps.onClick = handleDrilldownJabatanAkademik;
            chartProps.breadcrumbs = jabatanAkademikBreadcrumbs;
            chartProps.onBreadcrumbClick = handleJabatanAkademikBreadcrumbClick;
            break;
          case 'top5-mata-kuliah':
            chartProps.onClick = handleDrilldownMataKuliah;
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
    distribusiJabatanDosen,
    top5MataKuliah,
    distribusiPerusahaan,
    sertifikasiProfesi,
    jabatanAkademikBreadcrumbs,
    activeReportingYear,
    activeJabatanAkademikData,
    isJabatanAkademikLoading,
    can,
    pageKey,
    theme,
    showLabels,
    handleDrilldownJabatanAkademik,
    handleJabatanAkademikBreadcrumbClick,
    handleDrilldownMataKuliah,
  ]);

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
              <div className="-mx-4">
                <DashboardGridLayout pageKey={pageKey}>
                  {chartChildren}
                </DashboardGridLayout>
              </div>
              <DrilldownModal
                isOpen={dataPraktisi !== null}
                onClose={() => {
                  setDataPraktisi(null);
                  setSelectedMataKuliah(null);
                }}
                title={`Daftar Praktisi Pengajar`}
                description={`Berikut adalah daftar praktisi pengajar mata kuliah ${selectedMataKuliah}.`}
                columns={practitionerColumns}
                data={dataPraktisi}
                isLoading={isDrilldownPraktisiLoading}
                onExport={handleExportDrilldownData}
                initialPageSize={5}
                searchPlaceholder="Cari berdasarkan Nama [ / ]"
              />
              {!isPublicView && (
                <div className="flex w-full items-center justify-end-safe mt-3 gap-4">
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
                          <ImportDialog type="practitioner_teachings" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="p-0 my-2 mx-1"
                        >
                          <ImportDialog type="field_experiences" />
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
              )}
            </div>
          </div>
        </div>
        {/* {!isPublicView && <BubbleChat />} */}
      </>
    </DashboardProvider>
  );
}
