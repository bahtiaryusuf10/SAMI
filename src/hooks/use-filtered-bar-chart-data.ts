import { useMemo } from 'react';
import { dataBarChart } from '@/data/dataBarChart'; // change able to call API later

export function useFilteredBarChartData(selectedCountry: string | null) {
  return useMemo(() => {
    return selectedCountry
      ? dataBarChart.filter((item) => item.country === selectedCountry)
      : dataBarChart;
  }, [selectedCountry]);
}

// GET DATA FROM API
// import { useQuery } from '@tanstack/react-query';

// export function useFilteredBarChartData(selectedCountry: string | null) {
//   const { data = [], isLoading } = useQuery(
//     ['barChartData'],
//     fetchBarChartData
//   );

//   const filtered = useMemo(() => {
//     return selectedCountry
//       ? data.filter((item) => item.country === selectedCountry)
//       : data;
//   }, [data, selectedCountry]);

//   return { data: filtered, isLoading };
// }
