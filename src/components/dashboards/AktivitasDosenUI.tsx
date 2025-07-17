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
  ArrowUpDown,
  BookOpenCheck,
  Loader2,
  User,
  UserCheck,
} from 'lucide-react';
import { MySingleValueChart } from '../charts/MySingleValueChart';
import { MyBarChart } from '../charts/MyBarChart';
import { useCallback, useMemo, useState } from 'react';
import { DashboardGridLayout } from '../DashboardGridLayout';
import { MyPieChart } from '../charts/MyPieChart';
import { Button } from '../ui/button';
import { ColumnDef } from '@tanstack/react-table';
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

interface DataTable {
  publication_title: string;
  authors: string;
  source_fund: number;
  publication_year: number;
  lecturer_id: string;
  lecturer_name: string;
  highest_qualification: string;
}

interface InfoAgregatAktivitasDosen {
  persentase_tridarma_di_luar_kampus: number;
  jumlah_dosen_tetap_program_studi: number;
  persentase_membina_mahasiswa: number;
}

interface DashboardData {
  infoAgregatAktivitasDosen: DataState<InfoAgregatAktivitasDosen>;
  distribusiPersentaseAktivitasDosen: DataState<ChartDataBar>;
  distribusiAktivitasDosen: DataState<ChartDataPie>;
  distribusiMembinaLomba: DataState<ChartDataBar>;
  sumberDanaPenelitianPkm: DataState<ChartDataPie>;
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
    id: 'distribusi-persentase-aktivitas-dosen',
    title: 'Dosen Beraktivitas di Luar Kampus',
    type: 'medium',
    component: MyBarChart,
    isDrillDown: true,
    chartProps: {
      layout: 'horizontal',
      dataKeys: ['value'],
      indexBy: 'label',
      axisBottomLegend: 'Jenis Aktivitas',
      axisLeftLegend: 'Persentase (%)',
    },
  },
  {
    id: 'distribusi-membina-lomba',
    title: 'Top 3 Dosen Pembina Lomba',
    type: 'medium',
    component: MyBarChart,
    chartProps: {
      layout: 'vertical',
      dataKeys: ['total_mentees'],
      indexBy: 'lecturer_name',
      axisBottomLegend: 'Nama Dosen',
      axisLeftLegend: 'Jumlah Mahasiswa',
    },
  },
  {
    id: 'distribusi-aktivitas-dosen',
    title: 'Distribusi Aktivitas Dosen',
    type: 'medium',
    component: MyPieChart,
  },
  {
    id: 'sumber-dana-penelitian-pkm',
    title: 'Sumber Dana Penelitian & Pengabdian',
    type: 'medium',
    component: MyPieChart,
    isDrillDown: true,
  },
] as const;

type DashboardId = (typeof dashboardConfig)[number]['id'];

const fundSourceColumns: ColumnDef<DataTable>[] = [
  {
    accessorKey: 'publication_title',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Judul
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-left whitespace-normal break-words line-clamp-3"
        title={row.getValue('publication_title')}
      >
        {row.getValue('publication_title')}
      </div>
    ),
    meta: {
      displayName: 'Judul',
    },
  },
  {
    accessorKey: 'authors',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nama Dosen
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className="text-center whitespace-normal break-words line-clamp-3"
          title={row.getValue('authors')}
        >
          {row.getValue('authors')}
        </div>
      );
    },
    meta: {
      displayName: 'Nama Dosen',
    },
  },
  {
    accessorKey: 'source_fund',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Sumber Dana
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('source_fund')}</div>;
    },
    meta: {
      displayName: 'Sumber Dana',
    },
  },
  {
    accessorKey: 'publication_year',
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
      return (
        <div className="text-center">{row.getValue('publication_year')}</div>
      );
    },
    meta: {
      displayName: 'Tahun',
    },
  },
];

const externalActivityColumns: ColumnDef<DataTable>[] = [
  {
    accessorKey: 'lecturer_id',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            NIDN/NIDK
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-center whitespace-normal break-words line-clamp-3"
        title={row.getValue('lecturer_id')}
      >
        {row.getValue('lecturer_id')}
      </div>
    ),
    meta: {
      displayName: 'NIDN/NIDK',
    },
  },
  {
    accessorKey: 'lecturer_name',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nama Dosen
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className="text-center whitespace-normal break-words line-clamp-3"
          title={row.getValue('lecturer_name')}
        >
          {row.getValue('lecturer_name')}
        </div>
      );
    },
    meta: {
      displayName: 'Nama Dosen',
    },
  },
  {
    accessorKey: 'highest_qualification',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Pendidikan Tertinggi
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue('highest_qualification')}
        </div>
      );
    },
    meta: {
      displayName: 'Pendidikan Tertinggi',
    },
  },
];

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
    distribusiPersentaseAktivitasDosen,
    distribusiAktivitasDosen,
    distribusiMembinaLomba,
    sumberDanaPenelitianPkm,
  } = dashboardData;

  // Drilldown Source Fund
  const [selectedSumberDana, setSelectedSumberDana] = useState<string | null>(
    null
  );
  const [dataPenelitianPkm, setDataPenelitianPkm] = useState<
    DataTable[] | null
  >(null);
  const [isDrilldownPenelitianPkmLoading, setIsDrilldownPenelitianPkmLoading] =
    useState(false);

  // Drilldown External Activity
  const [selectedTipeAktivitas, setSelectedTipeAktivitas] = useState<
    string | null
  >(null);
  const [dataDosen, setDataDosen] = useState<DataTable[] | null>(null);
  const [isDrilldownDosenLoading, setIsDrilldownDosenLoading] = useState(false);

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

  // Drilldown Data Handling for Source Fund
  const handleDrilldownPenelitianPkm = useCallback(
    async (pieData: { id: string; label: string }) => {
      const sumberDana = pieData.label;

      setSelectedSumberDana(sumberDana);
      setIsDrilldownPenelitianPkmLoading(true);
      setDataPenelitianPkm(null);

      try {
        const baseUrl = `/api/public/aktivitas-dosen/drilldown-sumber-dana-penelitian-pkm?sourceFund=${encodeURIComponent(
          sumberDana
        )}`;

        const finalUrl = activeReportingYear
          ? `${baseUrl}&year=${activeReportingYear}`
          : baseUrl;

        const response = await fetch(finalUrl);

        if (!response.ok)
          throw new Error(
            `Gagal fetch data penelitian & pengabdian untuk sumber dana ${sumberDana}`
          );

        const result = await response.json();
        console.log(result);
        setDataPenelitianPkm(result.data);
      } catch (error) {
        console.error(error);
        setDataPenelitianPkm([]);
      } finally {
        setIsDrilldownPenelitianPkmLoading(false);
      }
    },
    [activeReportingYear]
  );

  // Drilldown Data Handling for External Activity
  const handleDrilldownDosen = useCallback(
    async (barData: { indexValue: string }) => {
      const tipeAktivitas = barData.indexValue;

      setSelectedTipeAktivitas(tipeAktivitas);
      setIsDrilldownDosenLoading(true);
      setDataDosen(null);

      try {
        const baseUrl = `/api/public/aktivitas-dosen/drilldown-aktivitas-luar-kampus?activityType=${encodeURIComponent(
          tipeAktivitas
        )}`;

        const finalUrl = activeReportingYear
          ? `${baseUrl}&year=${activeReportingYear}`
          : baseUrl;

        const response = await fetch(finalUrl);

        if (!response.ok)
          throw new Error(`Gagal fetch data dosen ${tipeAktivitas}`);

        const result = await response.json();
        console.log(result);
        setDataDosen(result.data);
      } catch (error) {
        console.error(error);
        setDataDosen([]);
      } finally {
        setIsDrilldownDosenLoading(false);
      }
    },
    [activeReportingYear]
  );

  // Export drilldown
  const handleExportDrilldownData = () => {
    if (
      dataPenelitianPkm &&
      dataPenelitianPkm.length > 0 &&
      selectedSumberDana
    ) {
      const fileName = `Penelitian & pengabdian Sumber Dana ${selectedSumberDana}`;
      exportAsXlsx(dataPenelitianPkm, fileName);
    }
    if (dataDosen && dataDosen.length > 0 && selectedSumberDana) {
      const fileName = `Dosen ${selectedSumberDana}`;
      exportAsXlsx(dataDosen, fileName);
    }
  };

  // Chart Component
  const chartChildren = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataStateMap: Record<DashboardId, DataState<any>> = {
      'distribusi-persentase-aktivitas-dosen':
        distribusiPersentaseAktivitasDosen,
      'distribusi-aktivitas-dosen': distribusiAktivitasDosen,
      'distribusi-membina-lomba': distribusiMembinaLomba,
      'sumber-dana-penelitian-pkm': sumberDanaPenelitianPkm,
    };

    const dynamicDescription = `Data untuk tahun laporan ${activeReportingYear}`;

    return dashboardConfig.map((config) => {
      const ChartComponent = config.component;
      const chartState = dataStateMap[config.id];
      const chartProps = { ...(config.chartProps ?? {}) };

      if (config.id === 'distribusi-persentase-aktivitas-dosen') {
        chartProps.onClick = handleDrilldownDosen;
      }

      if (config.id === 'sumber-dana-penelitian-pkm') {
        chartProps.onClick = handleDrilldownPenelitianPkm;
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
    distribusiPersentaseAktivitasDosen,
    distribusiAktivitasDosen,
    distribusiMembinaLomba,
    sumberDanaPenelitianPkm,
    activeReportingYear,
    pageKey,
    theme,
    showLabels,
    handleDrilldownDosen,
    handleDrilldownPenelitianPkm,
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
              <DrilldownModal
                isOpen={dataPenelitianPkm !== null}
                onClose={() => {
                  setDataPenelitianPkm(null);
                  setSelectedSumberDana(null);
                }}
                title={`Sumber ${selectedSumberDana}`}
                description={`Berikut adalah daftar penelitian & pengabdian untuk
                          kategori ${selectedSumberDana}.`}
                columns={fundSourceColumns}
                data={dataPenelitianPkm}
                isLoading={isDrilldownPenelitianPkmLoading}
                onExport={handleExportDrilldownData}
                initialPageSize={5}
                searchPlaceholder="Cari berdasarkan Sumber Dana atau Judul [ / ]"
              />
              <DrilldownModal
                isOpen={dataDosen !== null}
                onClose={() => {
                  setDataDosen(null);
                  setSelectedTipeAktivitas(null);
                }}
                title={`Aktivitas ${selectedTipeAktivitas}`}
                description={`Berikut adalah daftar dosen ${selectedTipeAktivitas}.`}
                columns={externalActivityColumns}
                data={dataDosen}
                isLoading={isDrilldownDosenLoading}
                onExport={handleExportDrilldownData}
                initialPageSize={10}
                searchPlaceholder="Cari berdasarkan Nama Dosen atau NIDN/NIDK [ / ]"
              />
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
