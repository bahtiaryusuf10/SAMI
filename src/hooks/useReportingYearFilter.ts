import { useEffect } from 'react';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';

export function useReportingYearFilter(pageKey: string, filter: number | null) {
  const activeReportingYear = useDashboardSettingsStore(
    (state) => state.pageSettings[pageKey]?.activeReportingYear
  );

  const setActiveYear = useDashboardSettingsStore(
    (state) => state.setActiveReportingYear
  );

  useEffect(() => {
    if (activeReportingYear === undefined && filter !== null) {
      setActiveYear(pageKey, filter);
    }
  }, [filter, activeReportingYear, setActiveYear, pageKey]);

  return activeReportingYear;
}
