import { ColorSchemeId } from '@nivo/colors';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PageSettings {
  theme: ColorSchemeId;
  showLabels: boolean;
  activeReportingYear?:number | null;
}

export interface ChartSpecificSettings {
  layout?: 'vertical' | 'horizontal';
  groupMode?: 'grouped' | 'stacked';
  innerRadius?: number;
  arcLink?: number;
  sortByValue?: boolean;
  enableArea?: boolean;
}

interface DashboardState {
  pageSettings: Record<string, PageSettings>;
  chartSettings: Record<string, ChartSpecificSettings>;

  setPageTheme: (pageKey: string, theme: ColorSchemeId) => void;
  setPageShowLabels: (pageKey: string, show: boolean) => void;

  setChartSetting: (
    chartInstanceId: string,
    newSettings: Partial<ChartSpecificSettings>
  ) => void;

  reset: () => void;

  setActiveReportingYear: (pageKey: string, year: number | null) => void;
}

const initialState = {
  pageSettings: {},
  chartSettings: {},
};

export const useDashboardSettingsStore = create(
  persist(
    immer<DashboardState>((set) => ({
      ...initialState,
      setPageTheme: (pageKey, theme) =>
        set((state) => {
          if (!state.pageSettings[pageKey]) {
            state.pageSettings[pageKey] = {
              theme: 'pastel1',
              showLabels: true,
            };
          }
          state.pageSettings[pageKey].theme = theme;
        }),
      setPageShowLabels: (pageKey, show) =>
        set((state) => {
          if (!state.pageSettings[pageKey]) {
            state.pageSettings[pageKey] = {
              theme: 'pastel1',
              showLabels: true,
            };
          }
          state.pageSettings[pageKey].showLabels = show;
        }),
      setChartSetting: (chartInstanceId, newSettings) =>
        set((state) => ({
          chartSettings: {
            ...state.chartSettings,
            [chartInstanceId]: {
              ...state.chartSettings[chartInstanceId],
              ...newSettings,
            },
          },
        })),
      reset: () => set(initialState),
      setActiveReportingYear: (pageKey, year) =>
        set((state) => {
          if (!state.pageSettings[pageKey]) {
            state.pageSettings[pageKey] = {
              theme: 'pastel1',
              showLabels: true,
              activeReportingYear: year,
            };
          }
          state.pageSettings[pageKey].activeReportingYear = year;
        }),
    })),
    {
      name: 'dashboard-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
