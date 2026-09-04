'use client';

// import ImportDialog from '@/components/ImportDialog';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { ShareButton } from '../ShareButton';
import { DashboardSettings } from '../settings/DashboardSettings';
import { PageHeader } from '@/components/layout/PageHeader';
import { QuickFilter } from '../settings/QuickFilter';
import { MySingleValueChart } from '../charts/MySingleValueChart';
import {
  AlertTriangle,
  Book,
  Loader2,
  Puzzle,
  User,
} from 'lucide-react';
import { MyBarChart } from '../charts/MyBarChart';
import { useCallback, useMemo, useState } from 'react';
import { DashboardGridLayout } from '../DashboardGridLayout';
import { MyPieChart } from '../charts/MyPieChart';
import { ColumnDef } from '@tanstack/react-table';
import { exportAsXlsx } from '@/lib/utils/handleExportFile';
import { DrilldownModal } from '../modals/DrilldownModal';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { useUser } from '@/contexts/UserContext';
import { ExecutiveSummary } from '../ExecutiveSummary';
import { SortableHeader } from '@/components/tables/SortableHeader';

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
  value: string;
}

interface DataTable {
  course_id: string;
  course_name: string;
  course_category: string;
  lecturer_names: string;
}

interface InfoAgregatKelasKolaboratif {
  jumlah_mata_kuliah: number;
  persentase_mata_kuliah_case_dan_team: number;
  jumlah_dosen_pengajar_mata_kuliah_case_dan_team: number;
}

interface DashboardData {
  infoAgregatKelasKolaboratif: DataState<InfoAgregatKelasKolaboratif>;
  distribusiCaseProject: DataState<ChartDataBar>;
  top5DosenCaseProject: DataState<ChartDataBar>;
  distribusiJenisMataKuliah: DataState<ChartDataPie>;
  distribusiMetodeMataKuliah: DataState<ChartDataPie>;
}

interface KelasKolaboratifUIProps {
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
    id: 'distribusi-case-project',
    title: 'Distribusi Case Method & Project',
    type: 'medium',
    component: MyBarChart,
    isDrillDown: true,
    chartProps: {
      dataKeys: ['value'],
      indexBy: 'label',
      axisBottomLegend: 'Semester',
      axisLeftLegend: 'Jumlah Mata Kuliah',
    },
  },
  {
    id: 'distribusi-jenis-mata-kuliah',
    title: 'Proporsi Jenis Mata Kuliah',
    type: 'medium',
    isDrillDown: true,
    component: MyPieChart,
  },
  {
    id: 'distribusi-metode-mata-kuliah',
    title: 'Proporsi Metode Mata Kuliah',
    type: 'medium',
    component: MyPieChart,
  },
  {
    id: 'top5-dosen-case-project',
    title: 'Top 5 Dosen Case Method & Project',
    type: 'medium',
    component: MyBarChart,
    chartProps: {
      layout: 'horizontal',
      dataKeys: ['value'],
      indexBy: 'label',
      axisBottomLegend: 'Nama Dosen',
      axisLeftLegend: 'Jumlah Mata Kuliah',
    },
  },
] as const;

type DashboardId = (typeof dashboardConfig)[number]['id'];

const courseColumns: ColumnDef<DataTable>[] = [
  {
    accessorKey: 'course_id',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Kode" />
      );
    },
    cell: ({ row }) => (
      <div className="text-center w-[150px]" title={row.getValue('course_id')}>
        {row.getValue('course_id')}
      </div>
    ),
    meta: {
      displayName: 'Kode',
    },
  },
  {
    accessorKey: 'course_name',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Nama" />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center whitespace-normal break-words line-clamp-3">
          {row.getValue('course_name')}
        </div>
      );
    },
    meta: {
      displayName: 'Nama',
    },
  },
  {
    accessorKey: 'course_category',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Jenis" />
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className="text-center truncate"
          title={row.getValue('course_category')}
        >
          {row.getValue('course_category')}
        </div>
      );
    },
    meta: {
      displayName: 'Jenis',
    },
  },
  {
    accessorKey: 'lecturer_names',
    header: ({ column }) => {
      return (
        <SortableHeader column={column} label="Dosen Pengampu" />
      );
    },
    cell: ({ row }) => {
      const lecturersString = row.getValue('lecturer_names') as string;
      const lecturersArray = lecturersString ? lecturersString.split('\n') : [];
      const MAX_VISIBLE = 2;

      if (lecturersArray.length <= MAX_VISIBLE) {
        return (
          <div className="flex flex-wrap gap-1">
            {lecturersArray.map((lecturer, index) => (
              <Badge key={index} variant="secondary">
                {lecturer}
              </Badge>
            ))}
          </div>
        );
      }

      const visibleLecturers = lecturersArray.slice(0, MAX_VISIBLE);
      const hiddenCount = lecturersArray.length - MAX_VISIBLE;

      return (
        <div className="flex flex-wrap items-center gap-1">
          {visibleLecturers.map((lecturer, index) => (
            <Badge key={index} variant="secondary">
              {lecturer}
            </Badge>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Badge
                variant="default"
                className="cursor-pointer bg-blue-300 hover:bg-blue-200"
              >
                + {hiddenCount} lainnya
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="flex flex-col gap-1">
                {lecturersArray.map((lecturer, index) => (
                  <div key={index} className="text-sm p-1">
                    {lecturer}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
    meta: {
      displayName: 'Dosen Pengampu',
    },
  },
];

export function KelasKolaboratifUI({
  pageKey,
  dashboardData,
  isPublicView = false,
  initialActiveYear = null,
}: KelasKolaboratifUIProps): JSX.Element {
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
    infoAgregatKelasKolaboratif,
    distribusiCaseProject,
    top5DosenCaseProject,
    distribusiJenisMataKuliah,
    distribusiMetodeMataKuliah,
  } = dashboardData;

  const summaryData = {
    infoAgregatKelasKolaboratif: infoAgregatKelasKolaboratif.data,
    distribusiCaseProject: distribusiCaseProject.data,
    top5DosenCaseProject: top5DosenCaseProject.data,
    distribusiJenisMataKuliah: distribusiJenisMataKuliah.data,
    distribusiMetodeMataKuliah: distribusiMetodeMataKuliah.data,
  };

  // Drilldown Mata Kuliah
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [dataMataKuliah, setDataMataKuliah] = useState<DataTable[] | null>(
    null
  );
  const [isDrilldownMataKuliahLoading, setIsDrilldownMataKuliahLoading] =
    useState(false);

  // Drilldown jenis mata kuliah
  const [activeJenisMataKuliahData, setActiveJenisMataKuliahData] =
    useState(null);
  const [jenisMataKuliahBreadcrumbs, setJenisMataKuliahBreadcrumbs] = useState([
    { label: 'Jenis Mata Kuliah', level: 0 },
  ]);
  const [isJenisMataKuliahLoading, setIsJenisMataKuliahLoading] =
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
  const handleDrilldownMataKuliah = useCallback(
    async (barData: { indexValue: string; id: string }) => {
      const semester = barData.indexValue;

      setSelectedSemester(semester);
      setIsDrilldownMataKuliahLoading(true);
      setDataMataKuliah(null);

      try {
        const baseUrl = `/api/public/kelas-kolaboratif/drilldown-course-project-per-semester?semester=${encodeURIComponent(
          semester
        )}`;

        const finalUrl = activeReportingYear
          ? `${baseUrl}&year=${activeReportingYear}`
          : baseUrl;

        const response = await fetch(finalUrl);

        if (!response.ok)
          throw new Error(`Gagal fetch data mata kuliah untuk ${semester}`);

        const result = await response.json();
        setDataMataKuliah(result.data);
      } catch (error) {
        console.error(error);
        setDataMataKuliah([]);
      } finally {
        setIsDrilldownMataKuliahLoading(false);
      }
    },
    [activeReportingYear]
  );

  // Export drilldown
  const handleExportDrilldownData = () => {
    if (dataMataKuliah && dataMataKuliah.length > 0 && selectedSemester) {
      const fileName = `Mata Kuliah Course & Project semester ${selectedSemester}`;
      exportAsXlsx(dataMataKuliah, fileName, courseColumns);
    }
  };

  // Drilldown Data Handling for Course Category
  const handleDrilldownJenisMataKuliah = useCallback(
    async (pieData: { id: string }) => {
      const coursetype = pieData.id;

      if (jenisMataKuliahBreadcrumbs.length > 1) return;

      setIsJenisMataKuliahLoading(true);
      try {
        const baseUrl = `/api/public/kelas-kolaboratif/drilldown-jenis-mata-kuliah?coursetype=${coursetype}`;
        const finalUrl = activeReportingYear
          ? `${baseUrl}&year=${activeReportingYear}`
          : baseUrl;
        const response = await fetch(finalUrl);

        if (!response.ok) throw new Error('Gagal fetch data detail');

        const result = await response.json();

        setActiveJenisMataKuliahData(result.data);
        setJenisMataKuliahBreadcrumbs((prev) => [
          ...prev,
          { label: `${coursetype}`, level: 1 },
        ]);
      } catch (error) {
        console.error(error);
        setActiveJenisMataKuliahData(null);
      } finally {
        setIsJenisMataKuliahLoading(false);
      }
    },
    [activeReportingYear, jenisMataKuliahBreadcrumbs]
  );

  const handleJenisMataKuliahBreadcrumbClick = useCallback((level: number) => {
    if (level === 0) {
      setJenisMataKuliahBreadcrumbs((prev) => prev.slice(0, 1));
    }
  }, []);

  // Chart Component
  const chartChildren = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataStateMap: Record<DashboardId, DataState<any>> = {
      'distribusi-case-project': distribusiCaseProject,
      'top5-dosen-case-project': top5DosenCaseProject,
      'distribusi-jenis-mata-kuliah': distribusiJenisMataKuliah,
      'distribusi-metode-mata-kuliah': distribusiMetodeMataKuliah,
    };

    const dynamicDescription = `Data untuk tahun laporan ${activeReportingYear}`;

    // eslint-disable-next-line prefer-const
    let tempDashboardConfig = [...dashboardConfig];

    if (jenisMataKuliahBreadcrumbs.length > 1) {
      const jenisMataKuliahChartIndex = tempDashboardConfig.findIndex(
        (config) => config.id === 'distribusi-jenis-mata-kuliah'
      );

      if (jenisMataKuliahChartIndex !== -1) {
        tempDashboardConfig[jenisMataKuliahChartIndex] = {
          ...tempDashboardConfig[jenisMataKuliahChartIndex],
          title: `Proporsi Jenis Mata Kuliah`,
          component: MyBarChart,
          chartProps: {
            dataKeys: ['value'],
            indexBy: 'label',
            axisBottomLegend: 'Tingkat',
            axisLeftLegend: 'Jumlah',
            breadcrumbs: jenisMataKuliahBreadcrumbs,
            onBreadcrumbClick: handleJenisMataKuliahBreadcrumbClick,
          },
        };
      }
    }

    if (jenisMataKuliahBreadcrumbs.length > 1) {
      dataStateMap['distribusi-jenis-mata-kuliah'] = {
        data: activeJenisMataKuliahData,
        isLoading: isJenisMataKuliahLoading,
        error: null,
      };
    }

    return tempDashboardConfig.map((config) => {
      const ChartComponent = config.component;
      const chartState = dataStateMap[config.id];
      const chartProps = { ...(config.chartProps ?? {}) };

      if (can('interact:charts')) {
        switch (config.id) {
          case 'distribusi-case-project':
            chartProps.onClick = handleDrilldownMataKuliah;
            break;
          case 'distribusi-jenis-mata-kuliah':
            chartProps.onClick = handleDrilldownJenisMataKuliah;
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
    distribusiCaseProject,
    top5DosenCaseProject,
    distribusiJenisMataKuliah,
    distribusiMetodeMataKuliah,
    activeReportingYear,
    jenisMataKuliahBreadcrumbs,
    handleJenisMataKuliahBreadcrumbClick,
    activeJenisMataKuliahData,
    isJenisMataKuliahLoading,
    can,
    pageKey,
    theme,
    showLabels,
    handleDrilldownMataKuliah,
    handleDrilldownJenisMataKuliah,
  ]);

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <PageHeader
            title="Kelas Kolaboratif"
            description="IKU 7 Kelas yang kolaboratif dan partisipatif."
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
                    apiUrl="/api/public/filters/tahun-laporan-by-tipe?types=courses"
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
              <div className="-mx-4">
                <DashboardGridLayout pageKey={pageKey}>
                  {chartChildren}
                </DashboardGridLayout>
              </div>
              <DrilldownModal
                isOpen={dataMataKuliah !== null}
                onClose={() => {
                  setDataMataKuliah(null);
                  setSelectedSemester(null);
                }}
                title={`Daftar Mata Kuliah`}
                description={`Berikut adalah daftar mata kuliah case method, team based project, dan case method & team based project untuk semester ${selectedSemester}.`}
                columns={courseColumns}
                data={dataMataKuliah}
                isLoading={isDrilldownMataKuliahLoading}
                onExport={handleExportDrilldownData}
                initialPageSize={5}
                searchPlaceholder="Cari Kode Mata Kuliah atau Nama [ / ]"
              />
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
