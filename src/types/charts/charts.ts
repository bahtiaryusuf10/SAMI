export interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

export interface ChartDataPie {
  id: string;
  label: string;
  value: number;
}

export interface ChartDataBar {
  label: string;
  value: number;
}