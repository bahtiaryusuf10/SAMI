'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { QuickFilter } from '../settings/QuickFilter';
import AddReportDialog from '../AddReportDialog';
import { useUser } from '@/contexts/UserContext';
import { SheetViewer } from '../SheetViewer';

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface Laporan {
  source_url: string;
}

interface Data {
  infoLaporan: DataState<Laporan>;
}

interface LaporanAmiUIProps {
  pageKey: string;
  data: Data;
  isPublicView?: boolean;
  initialActiveYear?: number | null;
}

export function LaporanAmiUI({
  pageKey,
  data,
  isPublicView = false,
  initialActiveYear = null,
}: LaporanAmiUIProps): JSX.Element {
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

  const { infoLaporan } = data;

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <div className="flex w-full items-center justify-between px-2 pt-2 mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold text-white">
                Hasil Laporan AMI
              </h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  Berikut merupakan dokumen hasil laporan AMI untuk aspek
                  Indikator Kinerja Utama (IKU).
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
                  apiUrl="/api/public/filters/tahun-laporan-link"
                  activeValue={activeReportingYear}
                  onValueChange={handleValueChange}
                  showAllOption={false}
                />
              )}
            </div>
          </div>
          <div className="px-2 py-0 flex flex-col gap-4 mb-8">
            <div className="w-full">
              <div className="-mx-4">
                <div className="flex flex-row px-4 mb-4">
                  <SheetViewer url={infoLaporan.data?.source_url} title="" />
                </div>
              </div>
              {!isPublicView && (
                <div className="flex w-full items-center justify-end-safe mt-3 gap-4">
                  {can('manage:reports') && <AddReportDialog />}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </DashboardProvider>
  );
}
