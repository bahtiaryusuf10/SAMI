import { useMemo } from 'react';
import { dataPieChart } from '@/data/dataPieChart'; // change able to call API later

// export function useFilteredPieChartData(limit?: number) {
//   return useMemo(() => {
//     const countMap: Record<string, number> = {};

//     dataPieChart.forEach((item) => {
//       countMap[item.language] = (countMap[item.language] || 0) + 1;
//     });

//     let pieData = Object.entries(countMap).map(([language, value]) => ({
//       id: language,
//       label: language,
//       value,
//     }));

//     if (limit) {
//       pieData = pieData.sort((a, b) => b.value - a.value).slice(0, limit);
//     }

//     return pieData;
//   }, [limit]);
// }

// export function useAggregatedPieData() {
//   return useMemo(() => {
//     const grouped = dataPieChart.reduce<Record<string, number>>((acc, item) => {
//       acc[item.language] = (acc[item.language] || 0) + 1;
//       return acc;
//     }, {});

//     return Object.entries(grouped).map(([language, count]) => ({
//       id: language,
//       label: language,
//       value: count,
//     }));
//   }, []);
// }

export function useAggregatedPieData(limit = 4) {
  return useMemo(() => {
    const grouped = dataPieChart.reduce<Record<string, number>>((acc, item) => {
      acc[item.language] = (acc[item.language] || 0) + 1;
      return acc;
    }, {});

    const entries = Object.entries(grouped)
      .map(([language, count]) => ({
        id: language,
        label: language,
        value: count,
      }))
      .sort((a, b) => b.value - a.value); // sort descending

    if (entries.length <= limit) return entries;

    const topItems = entries.slice(0, limit);
    const otherTotal = entries
      .slice(limit)
      .reduce((sum, item) => sum + item.value, 0);

    return [...topItems, { id: 'Others', label: 'Others', value: otherTotal }];
  }, [limit]);
}
